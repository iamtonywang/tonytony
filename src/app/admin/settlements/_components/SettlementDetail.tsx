/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import type { SettlementRequestSelection } from "./SettlementRequestList";
import SettlementRequestProcess from "./SettlementRequestProcess";

type LineItem = {
	amountSnapshot: string;
	settlementStatus: string;
	settlementAmount: string;
	settlementAvailableAt: string;
	orderNumber: string;
	referralCode: string | null;
};

type DetailItem = SettlementRequestSelection & {
	loginId: string;
	realName: string | null;
	phone: string;
	email: string | null;
	requestStatus: string;
	requestAmount: string;
	requestNote: string | null;
	paymentMemo: string | null;
	requestedAt: string;
	approvedAt: string | null;
	rejectedAt: string | null;
	paidAt: string | null;
	bankName: string | null;
	accountHolder: string | null;
	accountNumberMasked: string | null;
	accountStatus: string | null;
	items: LineItem[];
};

type Props = {
	selection: SettlementRequestSelection | null;
	refreshKey: number;
	onProcessed: () => void;
};

export default function SettlementDetail({ selection, refreshKey, onProcessed }: Props) {
	const [item, setItem] = useState<DetailItem | null>(null);
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
				loginId: selection.loginId,
				requestedAt: selection.requestedAt,
				requestAmount: selection.requestAmount,
			});
			const res = await fetch(`/api/admin/settlements/detail?${q.toString()}`, { cache: "no-store" });
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
	}, [selection?.loginId, selection?.requestedAt, selection?.requestAmount, refreshKey]);

	if (!selection) {
		return (
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>정산 요청 상세</h2>
				<p style={{ margin: 0, opacity: 0.7 }}>목록에서 요청을 선택하세요.</p>
			</section>
		);
	}

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 8 }}>정산 요청 상세</h2>
			{loading ? <p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p> : null}
			{error && !loading ? <p style={{ margin: 0, color: "salmon" }}>{error}</p> : null}
			{item && !loading ? (
				<div style={{ display: "grid", gap: 10, fontSize: 14 }}>
					<div style={{ fontWeight: 600 }}>
						{item.loginId} · {item.requestStatus} · {item.requestAmount}
					</div>
					<div style={{ fontSize: 13, opacity: 0.9 }}>
						{item.realName ?? "—"} · {item.phone} · {item.email ?? "—"}
					</div>
					<div style={{ fontSize: 12, opacity: 0.85 }}>
						요청 {item.requestedAt}
						{item.approvedAt ? ` · 승인 ${item.approvedAt}` : ""}
						{item.rejectedAt ? ` · 반려 ${item.rejectedAt}` : ""}
						{item.paidAt ? ` · 지급 ${item.paidAt}` : ""}
					</div>
					{item.requestNote ? (
						<div>
							<strong>요청 메모</strong>
							<p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{item.requestNote}</p>
						</div>
					) : null}
					{item.paymentMemo ? (
						<div>
							<strong>지급 메모</strong>
							<p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{item.paymentMemo}</p>
						</div>
					) : null}
					<div style={{ fontSize: 13 }}>
						<strong>계좌</strong> {item.bankName ?? "—"} / {item.accountHolder ?? "—"} /{" "}
						{item.accountNumberMasked ?? "—"} / {item.accountStatus ?? "—"}
					</div>
					<div>
						<strong>포함 정산 건</strong>
						<ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13 }}>
							{item.items.length === 0 ? (
								<li>없음</li>
							) : (
								item.items.map((it, idx) => (
									<li key={`${it.orderNumber}-${idx}-${it.amountSnapshot}`}>
										주문 {it.orderNumber}
										{it.referralCode ? ` · 코드 ${it.referralCode}` : ""} · {it.settlementStatus} ·{" "}
										{it.settlementAmount} · 스냅샷 {it.amountSnapshot} · 가능일 {it.settlementAvailableAt}
									</li>
								))
							)}
						</ul>
					</div>
					<SettlementRequestProcess
						selection={selection}
						detail={{
							loginId: item.loginId,
							requestedAt: item.requestedAt,
							requestAmount: item.requestAmount,
							requestStatus: item.requestStatus,
						}}
						onProcessed={onProcessed}
					/>
				</div>
			) : null}
		</section>
	);
}
