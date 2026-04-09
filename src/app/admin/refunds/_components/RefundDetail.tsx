/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import RefundProcessAction from "./RefundProcessAction";

type PaymentSummary = {
	paymentStatus: string;
	paymentMethod: string;
	requestedAmount: number | string;
	approvedAmount: number | string | null;
	refundedAt: string | null;
} | null;

export type RefundDetailItem = {
	orderNumber: string;
	orderStatus: string;
	orderPaymentStatus: string;
	refundStatus: string;
	refundAmount: number | string;
	refundReason: string;
	rejectionReason: string | null;
	requestedAt: string;
	approvedAt: string | null;
	rejectedAt: string | null;
	completedAt: string | null;
	buyerLoginIdSnapshot: string;
	buyerRealNameSnapshot: string | null;
	buyerPhoneSnapshot: string;
	buyerEmailSnapshot: string | null;
	paymentSummary: PaymentSummary;
};

type Selection = {
	orderNumber: string;
	requestedAt: string;
};

type Props = {
	selection: Selection | null;
	refreshKey: number;
	onProcessed: () => void;
};

export default function RefundDetail({ selection, refreshKey, onProcessed }: Props) {
	const [item, setItem] = useState<RefundDetailItem | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!selection) {
			setItem(null);
			setError(null);
			return;
		}
		const run = async () => {
			setLoading(true);
			setError(null);
			const q = new URLSearchParams({
				orderNumber: selection.orderNumber,
				requestedAt: selection.requestedAt,
			});
			const res = await fetch(`/api/admin/refunds/detail?${q.toString()}`, { cache: "no-store" });
			const data = (await res.json()) as { ok?: boolean; item?: RefundDetailItem | null; message?: string | null };
			if (!res.ok || !data.ok || !data.item) {
				setItem(null);
				setError(data.message ?? "상세를 불러오지 못했습니다.");
				setLoading(false);
				return;
			}
			setItem(data.item);
			setLoading(false);
		};
		void run();
	}, [selection?.orderNumber, selection?.requestedAt, refreshKey]);

	if (!selection) {
		return (
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>환불 상세</h2>
				<p style={{ margin: 0, opacity: 0.7 }}>목록에서 건을 선택하세요.</p>
			</section>
		);
	}

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 8 }}>환불 상세</h2>
			{loading ? <p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p> : null}
			{error && !loading ? <p style={{ margin: 0, color: "salmon" }}>{error}</p> : null}
			{item && !loading ? (
				<div style={{ display: "grid", gap: 10, fontSize: 14 }}>
					<div style={{ fontWeight: 600 }}>{item.orderNumber}</div>
					<div>
						환불 상태 <strong>{item.refundStatus}</strong> · 금액 {String(item.refundAmount)}
					</div>
					<div>
						주문 상태 {item.orderStatus} · 주문 결제상태 {item.orderPaymentStatus}
					</div>
					<div style={{ fontSize: 13 }}>
						요청 {item.requestedAt}
						{item.approvedAt ? ` · 승인 ${item.approvedAt}` : ""}
						{item.rejectedAt ? ` · 반려 ${item.rejectedAt}` : ""}
						{item.completedAt ? ` · 완료 ${item.completedAt}` : ""}
					</div>
					<div>
						<strong>요청 사유</strong>
						<p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{item.refundReason}</p>
					</div>
					{item.rejectionReason ? (
						<div>
							<strong>반려 사유</strong>
							<p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{item.rejectionReason}</p>
						</div>
					) : null}
					<div>
						<strong>구매자</strong> {item.buyerLoginIdSnapshot} / {item.buyerRealNameSnapshot ?? "—"} / {item.buyerPhoneSnapshot} /{" "}
						{item.buyerEmailSnapshot ?? "—"}
					</div>
					{item.paymentSummary ? (
						<div style={{ fontSize: 13 }}>
							<strong>결제 요약</strong> {item.paymentSummary.paymentMethod} · {item.paymentSummary.paymentStatus} · 요청{" "}
							{String(item.paymentSummary.requestedAmount)} · 승인{" "}
							{item.paymentSummary.approvedAmount != null ? String(item.paymentSummary.approvedAmount) : "—"}
							{item.paymentSummary.refundedAt ? ` · 환불시각 ${item.paymentSummary.refundedAt}` : ""}
						</div>
					) : (
						<div style={{ fontSize: 13, opacity: 0.85 }}>결제 요약 없음</div>
					)}
					<RefundProcessAction
						detail={{
							orderNumber: item.orderNumber,
							requestedAt: item.requestedAt,
							refundStatus: item.refundStatus,
						}}
						onProcessed={onProcessed}
					/>
				</div>
			) : null}
		</section>
	);
}
