"use client";

import { useEffect, useRef, useState } from "react";

type RefundItem = {
	orderNumber: string | null;
	refundStatus: string | null;
	refundAmount: number | null;
	refundReason: string | null;
	requestedAt: string | null;
	approvedAt: string | null;
	rejectedAt: string | null;
	completedAt: string | null;
	paymentStatus: string | null;
	orderStatus: string | null;
};

export default function RefundsSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<RefundItem[]>([]);
	// Refunds 탭 진입 마운트 기준에서 StrictMode 중복 호출을 방지한다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchRefunds = async () => {
			try {
				const response = await fetch("/api/mypage/refunds", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: RefundItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "환불 목록을 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("환불 목록 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchRefunds();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>환불</h2>
				<p style={{ margin: 0 }}>환불 목록을 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>환불</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>환불</h2>
				<p style={{ margin: 0 }}>환불 내역이 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>환불</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.orderNumber ?? "refund"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>주문번호: {item.orderNumber ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>환불상태: {item.refundStatus ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>환불금액: {item.refundAmount ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>환불사유: {item.refundReason ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>요청시각: {item.requestedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>승인시각: {item.approvedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>거절시각: {item.rejectedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>완료시각: {item.completedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>결제상태: {item.paymentStatus ?? "-"}</p>
						<p style={{ margin: 0 }}>주문상태: {item.orderStatus ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

