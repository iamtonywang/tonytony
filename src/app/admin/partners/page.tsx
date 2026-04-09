/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ApplicationRow = {
	loginId: string;
	phone: string | null;
	applicationStatus: string;
};

type PartnerRow = {
	loginId: string;
	phone: string | null;
	partnerStatus: string;
};

type DetailData = {
	loginId: string;
	realName: string | null;
	phone: string | null;
	email: string | null;
	applicationStatus: string | null;
	partnerStatus: string | null;
	activeReferralCode: string | null;
	bankAccountMasked: string | null;
	// 판매현황: 최소 요약(미구현 placeholder)
	salesSummary: {
		todayGross: number | null;
		monthGross: number | null;
	} | null;
};

const PAGE_SIZE = 20;

export default function Page() {
	// 신청 목록
	const [appPage, setAppPage] = useState(1);
	const [appRows, setAppRows] = useState<ApplicationRow[]>([]);
	const [appHasNext, setAppHasNext] = useState(false);
	// 파트너 목록
	const [parPage, setParPage] = useState(1);
	const [parRows, setParRows] = useState<PartnerRow[]>([]);
	const [parHasNext, setParHasNext] = useState(false);
	// 상세
	const [selectedLoginId, setSelectedLoginId] = useState<string | null>(null);
	const [detail, setDetail] = useState<DetailData | null>(null);
	const isDetailOpen = useMemo(() => typeof selectedLoginId === "string" && selectedLoginId.length > 0, [selectedLoginId]);
	const hasFetchedApplicationsRef = useRef(false);
	const hasFetchedPartnersRef = useRef(false);

	const refetchPartnersPage = async (page: number) => {
		try {
			const res = await fetch(`/api/admin/partners/list?page=${page}`, { cache: "no-store" });
			if (!res.ok) {
				setParRows([]);
				setParHasNext(false);
				return;
			}
			const data = await res.json() as { ok: boolean; items: PartnerRow[]; hasNext: boolean };
			setParRows(Array.isArray(data.items) ? data.items : []);
			setParHasNext(Boolean(data.hasNext));
		} catch {
			setParRows([]);
			setParHasNext(false);
		}
	};

	// 신청 목록 로드
	useEffect(() => {
		if (appPage === 1 && hasFetchedApplicationsRef.current) return;
		if (appPage === 1) hasFetchedApplicationsRef.current = true;

		const run = async () => {
			const res = await fetch(`/api/admin/partners/applications?page=${appPage}`, { cache: "no-store" });
			if (!res.ok) { setAppRows([]); setAppHasNext(false); return; }
			const data = await res.json() as { ok: boolean; items: ApplicationRow[]; hasNext: boolean };
			setAppRows(Array.isArray(data.items) ? data.items : []);
			setAppHasNext(Boolean(data.hasNext));
		};
		run().catch(() => { setAppRows([]); setAppHasNext(false); });
	}, [appPage]);

	// 파트너 목록 로드
	useEffect(() => {
		if (parPage === 1 && hasFetchedPartnersRef.current) return;
		if (parPage === 1) hasFetchedPartnersRef.current = true;

		void refetchPartnersPage(parPage);
	}, [parPage]);

	// 상세 로드
	useEffect(() => {
		if (!selectedLoginId) { setDetail(null); return; }
		const run = async () => {
			const res = await fetch(`/api/admin/partners/detail/${encodeURIComponent(selectedLoginId)}`, { cache: "no-store" });
			if (!res.ok) { setDetail(null); return; }
			const data = await res.json() as { ok: boolean; item: DetailData | null };
			setDetail(data.item ?? null);
		};
		run().catch(() => setDetail(null));
	}, [selectedLoginId]);

	// 액션: 승인 / 차단
	const approve = async (loginId: string) => {
		await fetch("/api/admin/partners/approve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ loginId }),
		});
		// 목록 새로고침
		const res = await fetch(`/api/admin/partners/applications?page=${appPage}`, { cache: "no-store" });
		if (res.ok) {
			const data = await res.json() as { items: ApplicationRow[]; hasNext: boolean };
			setAppRows(Array.isArray(data.items) ? data.items : []);
			setAppHasNext(Boolean(data.hasNext));
		}
		// 선택된 상세도 같다면 새로 로드
		await refetchPartnersPage(parPage);
		if (selectedLoginId === loginId) {
			const d = await fetch(`/api/admin/partners/detail/${encodeURIComponent(loginId)}`, { cache: "no-store" });
			if (d.ok) {
				const jd = await d.json() as { item: DetailData | null };
				setDetail(jd.item ?? null);
			}
		}
	};
	const block = async (loginId: string) => {
		await fetch("/api/admin/partners/block", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ loginId, reason: "blocked by admin" }),
		});
		// 목록 새로고침
		const res = await fetch(`/api/admin/partners/applications?page=${appPage}`, { cache: "no-store" });
		if (res.ok) {
			const data = await res.json() as { items: ApplicationRow[]; hasNext: boolean };
			setAppRows(Array.isArray(data.items) ? data.items : []);
			setAppHasNext(Boolean(data.hasNext));
		}
		await refetchPartnersPage(parPage);
		if (selectedLoginId === loginId) {
			const d = await fetch(`/api/admin/partners/detail/${encodeURIComponent(loginId)}`, { cache: "no-store" });
			if (d.ok) {
				const jd = await d.json() as { item: DetailData | null };
				setDetail(jd.item ?? null);
			}
		}
	};

	// 코드 발행/비활성 (상세 내)
	const issueCode = async (loginId: string) => {
		await fetch("/api/admin/partners/codes/issue", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ loginId }),
		});
		await refetchPartnersPage(parPage);
		if (selectedLoginId === loginId) {
			const d = await fetch(`/api/admin/partners/detail/${encodeURIComponent(loginId)}`, { cache: "no-store" });
			if (d.ok) {
				const jd = await d.json() as { item: DetailData | null };
				setDetail(jd.item ?? null);
			}
		}
	};
	const deactivateCode = async (loginId: string) => {
		await fetch("/api/admin/partners/codes/deactivate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ loginId }),
		});
		await refetchPartnersPage(parPage);
		if (selectedLoginId === loginId) {
			const d = await fetch(`/api/admin/partners/detail/${encodeURIComponent(loginId)}`, { cache: "no-store" });
			if (d.ok) {
				const jd = await d.json() as { item: DetailData | null };
				setDetail(jd.item ?? null);
			}
		}
	};

	return (
		<div style={{ display: "grid", gap: 16, maxWidth: 1080, margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>Partners Module</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)" }}>
				신청 목록(승인/차단) • 파트너 목록 • 상세(코드 발행/비활성)
			</p>

			{/* 신청 목록 */}
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>신청 목록</h2>
				<div style={{ display: "grid", gap: 8 }}>
					{appRows.map((r) => (
						<div key={r.loginId} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center" }}>
							<button style={{ textAlign: "left" }} onClick={() => setSelectedLoginId(r.loginId)}>
								{r.loginId}
							</button>
							<div style={{ opacity: 0.85 }}>{r.phone ?? "-"}</div>
							<div style={{ opacity: 0.85 }}>{r.applicationStatus}</div>
							<div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
								<button onClick={() => approve(r.loginId)}>승인</button>
								<button onClick={() => block(r.loginId)}>차단</button>
							</div>
						</div>
					))}
					{appRows.length === 0 ? <div style={{ textAlign: "center", opacity: 0.7 }}>신청이 없습니다</div> : null}
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
					<button disabled={appPage <= 1} onClick={() => setAppPage((p) => Math.max(1, p - 1))}>이전</button>
					<div style={{ opacity: 0.8 }}>page {appPage}</div>
					<button disabled={!appHasNext} onClick={() => setAppPage((p) => p + 1)}>다음</button>
				</div>
			</section>

			{/* 파트너 목록 */}
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>파트너 목록</h2>
				<div style={{ display: "grid", gap: 8 }}>
					{parRows.map((r) => (
						<div key={r.loginId} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center" }}>
							<button style={{ textAlign: "left" }} onClick={() => setSelectedLoginId(r.loginId)}>
								{r.loginId}
							</button>
							<div style={{ opacity: 0.85 }}>{r.phone ?? "-"}</div>
							<div style={{ opacity: 0.85 }}>{r.partnerStatus}</div>
						</div>
					))}
					{parRows.length === 0 ? <div style={{ textAlign: "center", opacity: 0.7 }}>파트너가 없습니다</div> : null}
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
					<button disabled={parPage <= 1} onClick={() => setParPage((p) => Math.max(1, p - 1))}>이전</button>
					<div style={{ opacity: 0.8 }}>page {parPage}</div>
					<button disabled={!parHasNext} onClick={() => setParPage((p) => p + 1)}>다음</button>
				</div>
			</section>

			{/* 상세 보기 */}
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>상세</h2>
				{!isDetailOpen ? (
					<div style={{ textAlign: "center", opacity: 0.7 }}>좌측 목록에서 아이디를 클릭해 상세를 확인하세요</div>
				) : (
					<div style={{ display: "grid", gap: 6 }}>
						<div><strong>login_id</strong>: {detail?.loginId ?? selectedLoginId}</div>
						<div><strong>real_name</strong>: {detail?.realName ?? "-"}</div>
						<div><strong>phone</strong>: {detail?.phone ?? "-"}</div>
						<div><strong>email</strong>: {detail?.email ?? "-"}</div>
						<div><strong>application_status</strong>: {detail?.applicationStatus ?? "-"}</div>
						<div><strong>partner_status</strong>: {detail?.partnerStatus ?? "-"}</div>
						<div><strong>active code</strong>: {detail?.activeReferralCode ?? "-"}</div>
						<div><strong>bank account</strong>: {detail?.bankAccountMasked ?? "-"}</div>
						<div><strong>sales</strong>: today {detail?.salesSummary?.todayGross ?? "-"} / month {detail?.salesSummary?.monthGross ?? "-"}</div>
						<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
							<button onClick={() => issueCode(selectedLoginId!)}>코드 발행</button>
							<button onClick={() => deactivateCode(selectedLoginId!)}>코드 비활성</button>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}

