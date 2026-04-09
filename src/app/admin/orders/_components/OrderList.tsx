/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";

import OrderStatusView from "./OrderStatusView";

type ListItem = {
	orderNumber: string;
	buyerLoginIdSnapshot: string;
	buyerRealNameSnapshot: string | null;
	buyerPhoneSnapshot: string;
	orderStatus: string;
	paymentStatus: string;
	finalAmount: number | string;
	orderedAt: string;
};

type Props = {
	selectedOrderNumber: string | null;
	onSelectOrderNumber: (orderNumber: string) => void;
};

export default function OrderList({ selectedOrderNumber, onSelectOrderNumber }: Props) {
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState<ListItem[]>([]);
	const [total, setTotal] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [loading, setLoading] = useState(true);
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		if (page === 1 && hasFetchedRef.current) return;
		if (page === 1) hasFetchedRef.current = true;

		const run = async () => {
			setLoading(true);
			const res = await fetch(`/api/admin/orders/list?page=${page}`, { cache: "no-store" });
			if (!res.ok) {
				setRows([]);
				setTotal(0);
				setHasNext(false);
				setLoading(false);
				return;
			}
			const data = (await res.json()) as {
				ok?: boolean;
				items?: ListItem[];
				total?: number;
				hasNext?: boolean;
			};
			setRows(Array.isArray(data.items) ? data.items : []);
			setTotal(typeof data.total === "number" ? data.total : 0);
			setHasNext(Boolean(data.hasNext));
			setLoading(false);
		};
		void run();
	}, [page]);

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 12 }}>주문 목록</h2>
			{loading ? (
				<p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p>
			) : rows.length === 0 ? (
				<p style={{ margin: 0, opacity: 0.8 }}>주문이 없습니다.</p>
			) : (
				<div style={{ display: "grid", gap: 10 }}>
					{rows.map((r) => {
						const isSel = selectedOrderNumber === r.orderNumber;
						return (
							<button
								key={r.orderNumber}
								type="button"
								onClick={() => onSelectOrderNumber(r.orderNumber)}
								style={{
									textAlign: "left",
									border: isSel ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.2)",
									background: isSel ? "rgba(255,255,255,0.06)" : "transparent",
									color: "inherit",
									padding: 10,
									borderRadius: 4,
									cursor: "pointer",
									font: "inherit",
								}}
							>
								<div style={{ fontWeight: 600 }}>{r.orderNumber}</div>
								<div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
									{r.buyerLoginIdSnapshot} · {r.buyerRealNameSnapshot ?? "—"} · {r.buyerPhoneSnapshot}
								</div>
								<div style={{ marginTop: 6 }}>
									<OrderStatusView orderStatus={r.orderStatus} paymentStatus={r.paymentStatus} />
								</div>
								<div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
									금액 {String(r.finalAmount)} · {r.orderedAt}
								</div>
							</button>
						);
					})}
				</div>
			)}
			<div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
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
