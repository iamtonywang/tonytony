"use client";

import { useState } from "react";

type DetailLike = {
	orderNumber: string;
	requestedAt: string;
	refundStatus: string;
};

type Props = {
	detail: DetailLike | null;
	onProcessed: () => void;
};

export default function RefundProcessAction({ detail, onProcessed }: Props) {
	const [rejectReason, setRejectReason] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	if (!detail) return null;

	const bodyBase = () => ({
		orderNumber: detail.orderNumber,
		requestedAt: detail.requestedAt,
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

	const handleApprove = async () => {
		setErr(null);
		setBusy(true);
		try {
			await postJson("/api/refunds/approve", bodyBase());
			setRejectReason("");
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	const handleReject = async () => {
		setErr(null);
		const rr = rejectReason.trim();
		if (!rr) {
			setErr("반려 사유를 입력하세요.");
			return;
		}
		setBusy(true);
		try {
			await postJson("/api/refunds/reject", { ...bodyBase(), rejectionReason: rr });
			setRejectReason("");
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	const handleComplete = async () => {
		setErr(null);
		setBusy(true);
		try {
			await postJson("/api/refunds/complete", bodyBase());
			onProcessed();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "오류");
		} finally {
			setBusy(false);
		}
	};

	const st = detail.refundStatus;

	return (
		<div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
			<h3 style={{ margin: "0 0 8px", fontSize: 15 }}>처리</h3>
			{err ? <p style={{ margin: "0 0 8px", color: "salmon", fontSize: 13 }}>{err}</p> : null}
			{st === "requested" ? (
				<div style={{ display: "grid", gap: 10 }}>
					<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
						<button type="button" disabled={busy} onClick={() => void handleApprove()}>
							승인
						</button>
					</div>
					<label style={{ display: "grid", gap: 6, fontSize: 13 }}>
						<span>반려 사유 (필수)</span>
						<textarea
							value={rejectReason}
							onChange={(e) => setRejectReason(e.target.value)}
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
					<button type="button" disabled={busy} onClick={() => void handleComplete()}>
						환불 완료 처리
					</button>
				</div>
			) : null}
			{st === "rejected" || st === "completed" ? (
				<p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>추가 처리 없음 ({st})</p>
			) : null}
		</div>
	);
}
