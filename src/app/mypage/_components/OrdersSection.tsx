"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MyPage.module.css";

type OrderItem = {
	orderNumber: string | null;
	orderStatus: string | null;
	paymentStatus: string | null;
	finalAmount: number | null;
	orderedAt: string | null;
	refundExists: boolean;
	refundStatus: string | null;
	paymentMethod: string | null;
};

export default function OrdersSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<OrderItem[]>([]);
	// Orders 탭 진입 시 마운트되는 구조에서 StrictMode 중복 호출을 방지한다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchOrders = async () => {
			try {
				const response = await fetch("/api/mypage/orders", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: OrderItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "주문 목록을 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("주문 목록 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchOrders();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>주문</h2>
				<p style={{ margin: 0 }}>주문 목록을 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>주문</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>주문</h2>
				<div className={styles.emptyState}>주문 내역이 없습니다</div>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>주문</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.orderNumber ?? "order"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>주문번호: {item.orderNumber ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>주문상태: {item.orderStatus ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>결제상태: {item.paymentStatus ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>최종금액: {item.finalAmount ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>주문시각: {item.orderedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>환불여부: {item.refundExists ? "환불 있음" : "환불 없음"}</p>
						<p style={{ margin: "0 0 4px 0" }}>환불상태: {item.refundStatus ?? "-"}</p>
						<p style={{ margin: 0 }}>결제수단: {item.paymentMethod ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

