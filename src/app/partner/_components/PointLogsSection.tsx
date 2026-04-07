"use client";

import { useEffect, useRef, useState } from "react";

type PointLogItem = {
	pointType: string | null;
	pointAmount: number | null;
	balanceAfter: number | null;
	occurredAt: string | null;
};

function formatPointType(value: string | null): string {
	if (value === "EARN") return "적립";
	if (value === "USE") return "사용";
	if (value === "WITHDRAW") return "출금";
	return "-";
}

function formatPointAmount(value: number | null): string {
	if (value === null) return "-";
	if (value > 0) return `+${value}`;
	if (value < 0) return `${value}`;
	return "0";
}

export default function PointLogsSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<PointLogItem[]>([]);
	// 탭 진입 후 마운트 시 최초 1회 요청만 수행하도록 중복 호출을 막는다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchPointLogs = async () => {
			try {
				const response = await fetch("/api/partner/point-logs", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: PointLogItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "포인트 로그를 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("포인트 로그 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchPointLogs();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>포인트 로그</h2>
				<p style={{ margin: 0 }}>포인트 로그를 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>포인트 로그</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>포인트 로그</h2>
				<p style={{ margin: 0 }}>포인트 로그가 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>포인트 로그</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.occurredAt ?? "point-log"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>유형: {formatPointType(item.pointType)}</p>
						<p style={{ margin: "0 0 4px 0" }}>변동금액: {formatPointAmount(item.pointAmount)}</p>
						<p style={{ margin: "0 0 4px 0" }}>변동후잔액: {item.balanceAfter ?? "-"}</p>
						<p style={{ margin: 0 }}>발생시각: {item.occurredAt ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

