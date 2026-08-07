"use client";

import { useCallback, useRef, useState } from "react";

type AdminProductReviewListItem = {
	id: number;
	rating: number | null;
	content: string;
	reviewStatus: string;
	createdAt: string;
	authorLabel: string;
	isPrivate: boolean;
};

type PanelStatus = "idle" | "loading" | "success" | "empty" | "error";

type Props = {
	slug: string;
};

const sectionStyle = {
	border: "1px solid rgba(255,255,255,0.2)",
	padding: 12,
	marginBottom: 12,
	textAlign: "left" as const,
};

function safeMessage(raw: unknown, fallback: string): string {
	if (typeof raw !== "string") return fallback;
	const t = raw.trim();
	if (!t) return fallback;
	if (t.length > 120) return fallback;
	if (/^[a-z0-9_]+$/i.test(t)) return t;
	return fallback;
}

export default function AdminProductReviewsPanel({ slug }: Props) {
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState<PanelStatus>("idle");
	const [items, setItems] = useState<AdminProductReviewListItem[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const fetchedOnceRef = useRef(false);
	const loadingRef = useRef(false);

	const loadReviews = useCallback(async () => {
		if (loadingRef.current) return;
		loadingRef.current = true;
		setStatus("loading");
		setErrorMessage(null);

		try {
			const res = await fetch(`/api/admin/products/reviews?slug=${encodeURIComponent(slug)}`, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});
			const data = (await res.json().catch(() => null)) as
				| { ok?: boolean; items?: AdminProductReviewListItem[]; message?: string }
				| null;

			if (!res.ok || !data?.ok || !Array.isArray(data.items)) {
				setItems([]);
				setStatus("error");
				setErrorMessage(safeMessage(data?.message, "리뷰 목록을 불러오지 못했습니다."));
				return;
			}

			fetchedOnceRef.current = true;
			setItems(data.items);
			setStatus(data.items.length === 0 ? "empty" : "success");
		} catch {
			setItems([]);
			setStatus("error");
			setErrorMessage("리뷰 목록을 불러오지 못했습니다.");
		} finally {
			loadingRef.current = false;
		}
	}, [slug]);

	const handleToggle = () => {
		setOpen((prev) => {
			const next = !prev;
			if (next && !fetchedOnceRef.current && !loadingRef.current) {
				void loadReviews();
			}
			return next;
		});
	};

	return (
		<div style={sectionStyle}>
			<button
				type="button"
				onClick={handleToggle}
				aria-expanded={open}
				style={{
					cursor: "pointer",
					display: "inline-block",
					padding: "8px 14px",
					border: "1px solid rgba(255,255,255,0.2)",
					borderRadius: 2,
					color: "rgba(255,255,255,0.92)",
					background: "transparent",
					font: "inherit",
					fontWeight: 600,
				}}
			>
				Review Management {open ? "▾" : "▸"}
			</button>

			{open ? (
				<div style={{ marginTop: 12 }}>
					{status === "loading" ? (
						<p style={{ margin: 0, opacity: 0.85 }}>리뷰 목록을 불러오는 중...</p>
					) : null}

					{status === "error" ? (
						<div>
							<p role="alert" style={{ margin: "0 0 8px", color: "rgb(248, 113, 113)" }}>
								{errorMessage ?? "리뷰 목록을 불러오지 못했습니다."}
							</p>
							<button
								type="button"
								onClick={() => void loadReviews()}
								style={{
									cursor: "pointer",
									padding: "8px 16px",
									border: "1px solid rgba(255,255,255,0.2)",
									borderRadius: 2,
									color: "rgba(255,255,255,0.92)",
									background: "transparent",
								}}
							>
								재시도
							</button>
						</div>
					) : null}

					{status === "empty" ? (
						<p style={{ marginTop: 8, opacity: 0.8 }}>등록된 리뷰가 없습니다.</p>
					) : null}

					{status === "success" ? (
						<ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
							{items.map((row) => (
								<li
									key={row.id}
									style={{
										marginBottom: 14,
										paddingBottom: 12,
										borderBottom: "1px solid rgba(255,255,255,0.12)",
									}}
								>
									<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
										<strong>작성자</strong>: {row.authorLabel}
									</p>
									<p style={{ margin: "0 0 4px", opacity: 0.88, fontSize: 12 }}>
										<span
											style={{
												display: "inline-block",
												padding: "2px 8px",
												border: "1px solid rgba(255,255,255,0.22)",
												borderRadius: 2,
												color: "rgba(255,255,255,0.88)",
											}}
										>
											{row.isPrivate === true ? "비밀글" : "일반글"}
										</span>
									</p>
									<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
										<strong>평점</strong>:{" "}
										{row.rating !== null && row.rating !== undefined ? String(row.rating) : "—"}
									</p>
									<p style={{ margin: "0 0 4px", opacity: 0.95, whiteSpace: "pre-wrap" }}>
										<strong>리뷰내용</strong>: {row.content}
									</p>
									<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
										<strong>상태</strong>: {row.reviewStatus}
									</p>
									<p style={{ margin: 0, opacity: 0.95 }}>
										<strong>생성일</strong>: {row.createdAt}
									</p>
								</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}
		</div>
	);
}
