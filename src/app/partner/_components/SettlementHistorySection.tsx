"use client";

import { useEffect, useRef, useState } from "react";

type SettlementHistoryItem = {
	settlementStatus: string | null;
	settlementAmount: number | null;
	settlementAvailableAt: string | null;
	approvedAt: string | null;
	paidAt: string | null;
};

function formatSettlementStatus(value: string | null): string {
	if (value === "pending") return "정산 대기";
	if (value === "available") return "정산 가능";
	if (value === "paid") return "정산 완료";
	if (value === "cancelled") return "취소";
	return "-";
}

function formatSettlementAmount(value: number | null): string {
	if (value === null) return "-";
	return `₩${value.toLocaleString()}`;
}

export default function SettlementHistorySection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<SettlementHistoryItem[]>([]);
	// 탭 진입 후 마운트 시 최초 1회 요청만 수행하도록 중복 호출을 막는다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchSettlements = async () => {
			try {
				const response = await fetch("/api/partner/settlements", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: SettlementHistoryItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "정산 이력을 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("정산 이력 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchSettlements();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산이력</h2>
				<p style={{ margin: 0 }}>정산 이력을 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산이력</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산이력</h2>
				<p style={{ margin: 0 }}>정산 이력이 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>정산이력</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.settlementAvailableAt ?? "settlement"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>정산상태: {formatSettlementStatus(item.settlementStatus)}</p>
						<p style={{ margin: "0 0 4px 0" }}>정산금액: {formatSettlementAmount(item.settlementAmount)}</p>
						<p style={{ margin: "0 0 4px 0" }}>정산가능시각: {item.settlementAvailableAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>승인시각: {item.approvedAt ?? "-"}</p>
						<p style={{ margin: 0 }}>지급시각: {item.paidAt ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

