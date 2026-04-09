"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PartnerItem = {
	isPartner: boolean;
	partnerStatus: string | null;
	partnerCode: string | null;
	linkedCustomerCount: number | null;
	pendingApplicationExists: boolean | null;
};

export default function PartnerSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [item, setItem] = useState<PartnerItem | null>(null);
	// Partner 탭 마운트 시 최초 1회만 요청하도록 중복 호출을 막는다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchPartner = async () => {
			try {
				const response = await fetch("/api/mypage/partner", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					item?: PartnerItem | null;
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItem(payload.item ?? null);
					setErrorMessage(null);
					return;
				}

				setItem(null);
				setErrorMessage(payload?.message ?? "파트너 정보를 불러오지 못했습니다.");
			} catch {
				setItem(null);
				setErrorMessage("파트너 정보 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchPartner();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>파트너</h2>
				<p style={{ margin: 0 }}>파트너 정보를 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>파트너</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (!item) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>파트너</h2>
				<p style={{ margin: 0 }}>파트너 정보가 없습니다.</p>
			</section>
		);
	}

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>파트너</h2>
			<article style={{ border: "1px solid #ddd", padding: 8 }}>
				<p style={{ margin: "0 0 4px 0" }}>회원유형: {item.isPartner ? "파트너" : "일반회원"}</p>
				<p style={{ margin: "0 0 4px 0" }}>파트너상태: {item.partnerStatus ?? "-"}</p>
				<p style={{ margin: "0 0 4px 0" }}>파트너코드: {item.partnerCode ?? "-"}</p>
				<p style={{ margin: "0 0 4px 0" }}>연결고객수: {item.linkedCustomerCount ?? "-"}</p>
				<p style={{ margin: 0 }}>
					신청대기:
					{item.pendingApplicationExists === null
						? "-"
						: item.pendingApplicationExists
							? "신청 대기 있음"
							: "신청 대기 없음"}
				</p>
				{item.isPartner ? (
					<p style={{ margin: "12px 0 0 0" }}>
						<Link href="/partner">파트너 대시보드로 이동</Link>
					</p>
				) : null}
			</article>
		</section>
	);
}

