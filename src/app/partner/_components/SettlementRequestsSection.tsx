"use client";

import { useEffect, useRef, useState } from "react";

type SettlementRequestItem = {
	requestNumber: string | null;
	requestStatus: string | null;
	requestedAmount: number | null;
	requestedAt: string | null;
	approvedAt: string | null;
	rejectedAt: string | null;
	completedAt: string | null;
	itemCount: number | null;
};

export default function SettlementRequestsSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<SettlementRequestItem[]>([]);
	// 탭 진입 후 마운트되는 구조에서 중복 fetch를 방지한다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchSettlementRequests = async () => {
			try {
				const response = await fetch("/api/partner/settlement-requests", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: SettlementRequestItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "정산 요청 목록을 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("정산 요청 목록 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchSettlementRequests();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산요청</h2>
				<p style={{ margin: 0 }}>정산 요청 목록을 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산요청</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산요청</h2>
				<p style={{ margin: 0 }}>정산 요청 내역이 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>정산요청</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.requestedAt ?? "request"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>요청번호: -</p>
						<p style={{ margin: "0 0 4px 0" }}>요청상태: {item.requestStatus ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>요청금액: {item.requestedAmount ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>요청시각: {item.requestedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>승인시각: {item.approvedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>거절시각: {item.rejectedAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>완료시각: {item.completedAt ?? "-"}</p>
						<p style={{ margin: 0 }}>항목수: {item.itemCount ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

