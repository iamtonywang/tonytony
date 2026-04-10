"use client";

import { useState } from "react";

import type { SettlementRequestSelection } from "./SettlementRequestList";

type DetailLike = SettlementRequestSelection & {
	requestStatus: string;
};

type Props = {
	selection: SettlementRequestSelection | null;
	detail: DetailLike | null;
	onProcessed: () => void;
};

export default function SettlementRequestProcess({ selection, detail, onProcessed }: Props) {
	const [paymentMemo, setPaymentMemo] = useState("");
	const [rejectNote, setRejectNote] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	if (!selection || !detail) return null;

	const bodyBase = () => ({
		loginId: selection.loginId,
		requestedAt: selection.requestedAt,
		requestAmount: selection.requestAmount,
	});

	const postJson = async (url: string, body: Record<string, unknown>) => {
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const data = (await res.json()) as { ok?: boolean; message?: string | null };
		if (!res.ok || !data.ok) {
			throw new Error(data.message ?? "요청 실패");
		}
	};

	const st = detail.requestStatus;

	const handleApprove = async () => {
		setErr(null);
		setBusy(true);
		try {
			const memo = paymentMemo.trim();
			await postJson("/api/admin/settlements/approve", {
				...bodyBase(),
				...(memo ? { paymentMemo: memo } : {}),
			});
			setPaymentMemo("");
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	const handleReject = async () => {
		setErr(null);
		const note = rejectNote.trim();
		if (!note) {
			setErr("반려 사유를 입력하세요.");
			return;
		}
		setBusy(true);
		try {
			await postJson("/api/admin/settlements/reject", { ...bodyBase(), rejectionNote: note });
			setRejectNote("");
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	const handlePay = async () => {
		setErr(null);
		setBusy(true);
		try {
			await postJson("/api/admin/settlements/pay", bodyBase());
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
			<h3 style={{ margin: "0 0 8px", fontSize: 15 }}>처리</h3>
			{err ? <p style={{ margin: "0 0 8px", color: "salmon", fontSize: 13 }}>{err}</p> : null}
			{st === "pending" ? (
				<div style={{ display: "grid", gap: 10 }}>
					<label style={{ display: "grid", gap: 6, fontSize: 13 }}>
						<span>지급 메모 (승인 시 선택)</span>
						<input
							type="text"
							value={paymentMemo}
							onChange={(e) => setPaymentMemo(e.target.value)}
							style={{ maxWidth: 420, font: "inherit", padding: 8 }}
						/>
					</label>
					<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
						<button type="button" disabled={busy} onClick={() => void handleApprove()}>
							승인
						</button>
					</div>
					<label style={{ display: "grid", gap: 6, fontSize: 13 }}>
						<span>반려 사유 (필수)</span>
						<textarea
							value={rejectNote}
							onChange={(e) => setRejectNote(e.target.value)}
							rows={3}
							style={{ width: "100%", maxWidth: 420, font: "inherit", padding: 8 }}
						/>
					</label>
					<button type="button" disabled={busy} onClick={() => void handleReject()}>
						반려
					</button>
				</div>
			) : null}
			{st === "approved" ? (
				<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
					<button type="button" disabled={busy} onClick={() => void handlePay()}>
						지급 완료
					</button>
				</div>
			) : null}
			{st === "rejected" || st === "paid" ? (
				<p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>추가 처리 없음 ({st})</p>
			) : null}
		</div>
	);
}
