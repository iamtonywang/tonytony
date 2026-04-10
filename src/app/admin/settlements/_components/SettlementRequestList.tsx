/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

export type SettlementRequestSelection = {
	loginId: string;
	requestedAt: string;
	requestAmount: string;
};

type ListItem = {
	loginId: string;
	realName: string | null;
	phone: string;
	requestStatus: string;
	requestAmount: string;
	requestedAt: string;
	paidAt: string | null;
};

type Props = {
	selected: SettlementRequestSelection | null;
	onSelect: (row: SettlementRequestSelection) => void;
	refreshKey: number;
};

type ListLoadResult = { items: ListItem[]; total: number; hasNext: boolean };

/** Dedupes one in-flight initial list fetch across StrictMode mount/remount (same JS realm). */
let sharedInitialListFetch: Promise<ListLoadResult> | null = null;

async function loadListPage(pageNum: number): Promise<ListLoadResult> {
	const res = await fetch(`/api/admin/settlements/list?page=${pageNum}`, { cache: "no-store" });
	if (!res.ok) {
		return { items: [], total: 0, hasNext: false };
	}
	const data = (await res.json()) as {
		ok?: boolean;
		items?: ListItem[];
		total?: number;
		hasNext?: boolean;
	};
	return {
		items: Array.isArray(data.items) ? data.items : [],
		total: typeof data.total === "number" ? data.total : 0,
		hasNext: Boolean(data.hasNext),
	};
}

export default function SettlementRequestList({ selected, onSelect, refreshKey }: Props) {
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState<ListItem[]>([]);
	const [total, setTotal] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		const isInitialPage1 = page === 1 && refreshKey === 0;

		const apply = (r: ListLoadResult) => {
			if (cancelled) return;
			setRows(r.items);
			setTotal(r.total);
			setHasNext(r.hasNext);
			setLoading(false);
		};

		if (isInitialPage1) {
			setLoading(true);
			if (!sharedInitialListFetch) {
				sharedInitialListFetch = loadListPage(page).finally(() => {
					sharedInitialListFetch = null;
				});
			}
			void sharedInitialListFetch.then(apply);
			return () => {
				cancelled = true;
			};
		}

		setLoading(true);
		void loadListPage(page).then(apply);
		return () => {
			cancelled = true;
		};
	}, [page, refreshKey]);

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 12 }}>정산 요청 목록</h2>
			{loading ? (
				<p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p>
			) : rows.length === 0 ? (
				<p style={{ margin: 0, opacity: 0.8 }}>정산 요청이 없습니다.</p>
			) : (
				<div style={{ display: "grid", gap: 10 }}>
					{rows.map((r) => {
						const sel =
							selected?.loginId === r.loginId &&
							selected?.requestedAt === r.requestedAt &&
							selected?.requestAmount === r.requestAmount;
						return (
							<button
								key={`${r.loginId}-${r.requestedAt}-${r.requestAmount}`}
								type="button"
								onClick={() =>
									onSelect({
										loginId: r.loginId,
										requestedAt: r.requestedAt,
										requestAmount: r.requestAmount,
									})
								}
								style={{
									textAlign: "left",
									border: sel ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.2)",
									background: sel ? "rgba(255,255,255,0.06)" : "transparent",
									color: "inherit",
									padding: 10,
									borderRadius: 4,
									cursor: "pointer",
									font: "inherit",
								}}
							>
								<div style={{ fontWeight: 600 }}>{r.loginId}</div>
								<div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
									{r.realName ?? "—"} · {r.phone || "—"}
								</div>
								<div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
									{r.requestStatus} · {r.requestAmount} · {r.requestedAt}
									{r.paidAt ? ` · 지급 ${r.paidAt}` : ""}
								</div>
							</button>
						);
					})}
				</div>
			)}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: 12,
					alignItems: "center",
					flexWrap: "wrap",
					gap: 8,
				}}
			>
				<button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
					이전
				</button>
				<span style={{ opacity: 0.8 }}>
					page {page} · 전체 {total}건
				</span>
				<button type="button" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
					다음
				</button>
			</div>
		</section>
	);
}
