/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import OrderStatusView from "./OrderStatusView";

type LineItem = {
	productSlug: string;
	productNameSnapshot: string;
	unitPrice: number | string;
	quantity: number;
	lineTotalAmount: number | string;
};

type PaymentRow = {
	paymentMethod: string;
	paymentStatus: string;
	requestedAmount: number | string;
	approvedAmount: number | string | null;
	requestedAt: string;
	approvedAt: string | null;
	cancelledAt: string | null;
	refundedAt: string | null;
};

type RefundRow = {
	refundStatus: string;
	refundAmount: number | string;
	refundReason: string;
	requestedAt: string;
	approvedAt: string | null;
	rejectedAt: string | null;
	completedAt: string | null;
};

type DetailItem = {
	orderNumber: string;
	orderStatus: string;
	paymentStatus: string;
	currency: string;
	subtotalAmount: number | string;
	discountAmount: number | string;
	finalAmount: number | string;
	pointUsedAmount: number | string;
	isPointPayment: boolean;
	buyerLoginIdSnapshot: string;
	buyerRealNameSnapshot: string | null;
	buyerPhoneSnapshot: string;
	buyerEmailSnapshot: string;
	receiverName: string;
	receiverPhone: string;
	receiverEmail: string;
	zipcode: string;
	address1: string;
	address2: string | null;
	orderedAt: string;
	paidAt: string | null;
	completedAt: string | null;
	cancelledAt: string | null;
	refundedAt: string | null;
	orderItems: LineItem[];
	payments: PaymentRow[];
	refunds: RefundRow[];
};

type Props = {
	orderNumber: string | null;
};

export default function OrderDetail({ orderNumber }: Props) {
	const [item, setItem] = useState<DetailItem | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!orderNumber) {
			setItem(null);
			setError(null);
			return;
		}
		const run = async () => {
			setLoading(true);
			setError(null);
			const res = await fetch(`/api/admin/orders/detail/${encodeURIComponent(orderNumber)}`, {
				cache: "no-store",
			});
			const data = (await res.json()) as { ok?: boolean; item?: DetailItem | null; message?: string | null };
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
	}, [orderNumber]);

	if (!orderNumber) {
		return (
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>주문 상세</h2>
				<p style={{ margin: 0, opacity: 0.7 }}>목록에서 주문번호를 선택하세요.</p>
			</section>
		);
	}

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 8 }}>주문 상세</h2>
			{loading ? <p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p> : null}
			{error && !loading ? <p style={{ margin: 0, color: "salmon" }}>{error}</p> : null}
			{item && !loading ? (
				<div style={{ display: "grid", gap: 10, fontSize: 14 }}>
					<div style={{ fontWeight: 600 }}>{item.orderNumber}</div>
					<OrderStatusView orderStatus={item.orderStatus} paymentStatus={item.paymentStatus} />
					<div>
						<strong>통화</strong> {item.currency}
					</div>
					<div>
						<strong>소계</strong> {String(item.subtotalAmount)} · <strong>할인</strong> {String(item.discountAmount)} ·{" "}
						<strong>최종</strong> {String(item.finalAmount)}
					</div>
					<div>
						<strong>포인트 사용</strong> {String(item.pointUsedAmount)} · <strong>포인트결제</strong>{" "}
						{item.isPointPayment ? "예" : "아니오"}
					</div>
					<div>
						<strong>구매자</strong> {item.buyerLoginIdSnapshot} / {item.buyerRealNameSnapshot ?? "—"} / {item.buyerPhoneSnapshot}{" "}
						/ {item.buyerEmailSnapshot}
					</div>
					<div>
						<strong>수령</strong> {item.receiverName} / {item.receiverPhone} / {item.receiverEmail}
					</div>
					<div>
						<strong>주소</strong> ({item.zipcode}) {item.address1} {item.address2 ?? ""}
					</div>
					<div style={{ fontSize: 12, opacity: 0.9 }}>
						ordered {item.orderedAt} · paid {item.paidAt ?? "—"} · completed {item.completedAt ?? "—"} · cancelled{" "}
						{item.cancelledAt ?? "—"} · refunded {item.refundedAt ?? "—"}
					</div>
					<div>
						<strong>주문 품목</strong>
						<ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
							{item.orderItems.map((li, idx) => (
								<li key={`item-${idx}-${li.productSlug}`}>
									{li.productNameSnapshot} ({li.productSlug}) × {li.quantity} @ {String(li.unitPrice)} ={" "}
									{String(li.lineTotalAmount)}
								</li>
							))}
						</ul>
					</div>
					<div>
						<strong>결제 요약</strong>
						<ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
							{item.payments.map((p, i) => (
								<li key={`pay-${i}-${p.requestedAt}`}>
									{p.paymentMethod} · {p.paymentStatus} · 요청 {String(p.requestedAmount)} · 승인{" "}
									{p.approvedAmount != null ? String(p.approvedAmount) : "—"}
								</li>
							))}
						</ul>
					</div>
					<div>
						<strong>환불 요약</strong>
						<ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
							{item.refunds.length === 0 ? (
								<li>없음</li>
							) : (
								item.refunds.map((r, i) => (
									<li key={`ref-${i}-${r.requestedAt}`}>
										{r.refundStatus} · {String(r.refundAmount)} · {r.refundReason}
									</li>
								))
							)}
						</ul>
					</div>
				</div>
			) : null}
		</section>
	);
}
