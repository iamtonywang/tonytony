"use client";

import { useCallback, useRef, useState } from "react";

type AdminProductInquiryListItem = {
	id: number;
	title: string;
	content: string;
	inquiryStatus: string;
	answerContent: string | null;
	answeredAt: string | null;
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

export default function AdminProductInquiriesPanel({ slug }: Props) {
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState<PanelStatus>("idle");
	const [items, setItems] = useState<AdminProductInquiryListItem[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const [busyInquiryId, setBusyInquiryId] = useState<number | null>(null);
	const fetchedOnceRef = useRef(false);
	const loadingRef = useRef(false);

	const loadInquiries = useCallback(async () => {
		if (loadingRef.current) return;
		loadingRef.current = true;
		setStatus("loading");
		setErrorMessage(null);
		setActionError(null);

		try {
			const res = await fetch(`/api/admin/products/inquiries?slug=${encodeURIComponent(slug)}`, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});
			const data = (await res.json().catch(() => null)) as
				| { ok?: boolean; items?: AdminProductInquiryListItem[]; message?: string }
				| null;

			if (!res.ok || !data?.ok || !Array.isArray(data.items)) {
				setItems([]);
				setStatus("error");
				setErrorMessage(safeMessage(data?.message, "문의 목록을 불러오지 못했습니다."));
				return;
			}

			fetchedOnceRef.current = true;
			setItems(data.items);
			setStatus(data.items.length === 0 ? "empty" : "success");
		} catch {
			setItems([]);
			setStatus("error");
			setErrorMessage("문의 목록을 불러오지 못했습니다.");
		} finally {
			loadingRef.current = false;
		}
	}, [slug]);

	const handleToggle = () => {
		setOpen((prev) => {
			const next = !prev;
			if (next && !fetchedOnceRef.current && !loadingRef.current) {
				void loadInquiries();
			}
			return next;
		});
	};

	const postInquiry = async (body: Record<string, unknown>) => {
		const res = await fetch("/api/admin/products/inquiry", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(body),
		});
		const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
		if (!res.ok || data?.ok !== true) {
			throw new Error(safeMessage(data?.message, "요청에 실패했습니다."));
		}
	};

	const handleAnswer = async (inquiryId: number, answerContent: string) => {
		if (busyInquiryId !== null) return;
		const trimmed = answerContent.trim();
		if (!trimmed) {
			setActionError("answer_content_required");
			return;
		}
		setBusyInquiryId(inquiryId);
		setActionError(null);
		try {
			await postInquiry({ inquiryId, answerContent: trimmed });
			fetchedOnceRef.current = false;
			await loadInquiries();
		} catch (e) {
			setActionError(e instanceof Error ? e.message : "요청에 실패했습니다.");
		} finally {
			setBusyInquiryId(null);
		}
	};

	const handleHide = async (inquiryId: number) => {
		if (busyInquiryId !== null) return;
		setBusyInquiryId(inquiryId);
		setActionError(null);
		try {
			await postInquiry({ action: "hide", inquiryId });
			fetchedOnceRef.current = false;
			await loadInquiries();
		} catch (e) {
			setActionError(e instanceof Error ? e.message : "요청에 실패했습니다.");
		} finally {
			setBusyInquiryId(null);
		}
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
				Inquiry Management {open ? "▾" : "▸"}
			</button>

			{open ? (
				<div style={{ marginTop: 12 }}>
					{status === "loading" ? (
						<p style={{ margin: 0, opacity: 0.85 }}>문의 목록을 불러오는 중...</p>
					) : null}

					{status === "error" ? (
						<div>
							<p role="alert" style={{ margin: "0 0 8px", color: "rgb(248, 113, 113)" }}>
								{errorMessage ?? "문의 목록을 불러오지 못했습니다."}
							</p>
							<button
								type="button"
								onClick={() => void loadInquiries()}
								disabled={loadingRef.current}
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

					{actionError ? (
						<p role="alert" style={{ margin: "0 0 8px", color: "rgb(248, 113, 113)" }}>
							{actionError}
						</p>
					) : null}

					{status === "empty" ? (
						<p style={{ marginTop: 8, opacity: 0.8 }}>등록된 문의가 없습니다.</p>
					) : null}

					{status === "success" ? (
						<ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
							{items.map((row) => {
								const replyLabel = row.answerContent ? "답변완료" : "미답변";
								const busy = busyInquiryId === row.id;
								return (
									<li
										key={row.id}
										style={{
											marginBottom: 14,
											paddingBottom: 12,
											borderBottom: "1px solid rgba(255,255,255,0.12)",
										}}
									>
										<div>
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
												<strong>제목</strong>: {row.title}
											</p>
											<p style={{ margin: "0 0 4px", opacity: 0.95, whiteSpace: "pre-wrap" }}>
												<strong>문의내용</strong>: {row.content}
											</p>
											<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
												<strong>상태</strong>: {row.inquiryStatus}
											</p>
											<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
												<strong>답변</strong>: {replyLabel}
											</p>
											<p style={{ margin: 0, opacity: 0.95 }}>
												<strong>생성일</strong>: {row.createdAt}
											</p>
											<button
												type="button"
												disabled={busyInquiryId !== null}
												onClick={() => void handleHide(row.id)}
												style={{ marginTop: 8, cursor: busy ? "wait" : "pointer" }}
											>
												{busy ? "처리 중..." : "삭제"}
											</button>
										</div>
										{row.answerContent ? (
											<div>
												<p style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>
													<strong>답변내용</strong>: {row.answerContent}
												</p>
												<p style={{ margin: "0 0 4px" }}>
													<strong>답변자</strong>: TONYWANG
												</p>
												{row.answeredAt ? (
													<p style={{ margin: 0 }}>
														<strong>답변일</strong>: {row.answeredAt}
													</p>
												) : null}
											</div>
										) : (
											<form
												style={{ marginTop: 8 }}
												onSubmit={(e) => {
													e.preventDefault();
													const fd = new FormData(e.currentTarget);
													const answer = String(fd.get("answerContent") ?? "");
													void handleAnswer(row.id, answer);
												}}
											>
												<label
													style={{ display: "block", marginBottom: 4, opacity: 0.88 }}
													htmlFor={`inq-answer-${row.id}`}
												>
													답변 작성
												</label>
												<textarea
													id={`inq-answer-${row.id}`}
													name="answerContent"
													required
													rows={4}
													disabled={busyInquiryId !== null}
													style={{
														width: "100%",
														maxWidth: 520,
														boxSizing: "border-box",
														padding: 8,
														background: "transparent",
														color: "rgba(255,255,255,0.92)",
														border: "1px solid rgba(255,255,255,0.3)",
														borderRadius: 2,
													}}
												/>
												<div style={{ marginTop: 6 }}>
													<button
														type="submit"
														disabled={busyInquiryId !== null}
														style={{
															cursor: busy ? "wait" : "pointer",
															padding: "8px 16px",
															border: "1px solid rgba(255,255,255,0.2)",
															borderRadius: 2,
															color: "rgba(255,255,255,0.92)",
															background: "transparent",
														}}
													>
														{busy ? "저장 중..." : "답변 저장"}
													</button>
												</div>
											</form>
										)}
									</li>
								);
							})}
						</ul>
					) : null}
				</div>
			) : null}
		</div>
	);
}
