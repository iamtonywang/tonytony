"use client";

import { useEffect, useRef, useState } from "react";

type InquiryItem = {
	inquiryType: string | null;
	inquiryStatus: string | null;
	subject: string | null;
	createdAt: string | null;
	answeredAt: string | null;
	orderNumber: string | null;
};

export default function InquiriesSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [items, setItems] = useState<InquiryItem[]>([]);
	// Inquiries 탭 마운트 시 최초 1회만 요청하도록 중복 호출을 막는다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchInquiries = async () => {
			try {
				const response = await fetch("/api/mypage/inquiries", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					items?: InquiryItem[];
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItems(Array.isArray(payload.items) ? payload.items : []);
					setErrorMessage(null);
					return;
				}

				setItems([]);
				setErrorMessage(payload?.message ?? "문의 목록을 불러오지 못했습니다.");
			} catch {
				setItems([]);
				setErrorMessage("문의 목록 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchInquiries();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>문의</h2>
				<p style={{ margin: 0 }}>문의 목록을 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>문의</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>문의</h2>
				<p style={{ margin: 0 }}>문의 내역이 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>문의</h2>
			<div style={{ display: "grid", gap: 8 }}>
				{items.map((item, index) => (
					<article key={`${item.orderNumber ?? "inquiry"}-${index}`} style={{ border: "1px solid #ddd", padding: 8 }}>
						<p style={{ margin: "0 0 4px 0" }}>문의유형: {item.inquiryType ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>문의상태: {item.inquiryStatus ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>제목: {item.subject ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>등록시각: {item.createdAt ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>답변시각: {item.answeredAt ?? "-"}</p>
						<p style={{ margin: 0 }}>주문번호: {item.orderNumber ?? "-"}</p>
					</article>
				))}
			</div>
		</section>
	);
}

