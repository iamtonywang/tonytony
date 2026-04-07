"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
	paymentKey: string | null;
	orderId: string | null;
	amount: string | null;
};

function toNumberOrNull(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string") {
		const t = v.trim();
		if (t !== "" && !Number.isNaN(Number(t))) return Number(t);
	}
	return null;
}

export default function SuccessClient({ paymentKey, orderId, amount }: Props) {
	const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
	const [confirmErrors, setConfirmErrors] = useState<Record<string, string> | null>(null);
	const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | number | null>(null);
	const [isConfirming, setIsConfirming] = useState<boolean>(false);
	const hasAttemptedConfirmRef = useRef<boolean>(false);

	useEffect(() => {
		// 중복 실행 완전 차단
		if (hasAttemptedConfirmRef.current) return;
		hasAttemptedConfirmRef.current = true;

		// sessionStorage에서 pendingPaymentId / pendingOrderId 읽기
		let storedPaymentId: string | null = null;
		let storedOrderId: string | null = null;
		try {
			if (typeof window !== "undefined" && window.sessionStorage) {
				const p = window.sessionStorage.getItem("pendingPaymentId");
				const o = window.sessionStorage.getItem("pendingOrderId");
				storedPaymentId = p && p.trim() !== "" ? p : null;
				storedOrderId = o && o.trim() !== "" ? o : null;
			}
		} catch {
			// storage 접근 실패 시에도 호출은 진행하지 않고 사용자 메시지 제공
		}

		// orderId 정합 검증
		if (orderId && storedOrderId && orderId !== storedOrderId) {
			setConfirmMessage("결제 응답의 orderId가 주문 정보와 일치하지 않습니다.");
			setConfirmErrors({ orderId: "mismatch" });
			setConfirmedPaymentId(null);
			return;
		}

		// paymentId 확보 규칙
		if (!storedPaymentId) {
			setConfirmMessage("paymentId가 아직 연결되지 않아 최종 결제 확인을 진행할 수 없습니다.");
			setConfirmErrors({ paymentId: "missing" });
			setConfirmedPaymentId(null);
			return;
		}

		// transactionId 확보 규칙: Toss Payments의 paymentKey를 우리 transactionId로 사용
		const transactionId = paymentKey ?? null;
		if (!transactionId) {
			setConfirmMessage("토스 결제 응답에서 paymentKey를 받지 못했습니다.");
			setConfirmErrors({ transactionId: "missing" });
			setConfirmedPaymentId(null);
			return;
		}

		// 숫자 변환 안전성 검증
		const parsedOrderId = toNumberOrNull(orderId ?? storedOrderId);
		const parsedPaymentId = toNumberOrNull(storedPaymentId);
		if (parsedOrderId === null || parsedPaymentId === null) {
			const errs: Record<string, string> = {};
			if (parsedOrderId === null) errs.orderId = "invalid";
			if (parsedPaymentId === null) errs.paymentId = "invalid";
			setConfirmMessage("결제 확인에 필요한 식별값 형식이 올바르지 않습니다.");
			setConfirmErrors(errs);
			setConfirmedPaymentId(null);
			return;
		}

		// 조건 충족 시에만 confirm 호출
		(async () => {
			setIsConfirming(true);
			try {
				const res = await fetch("/api/payments/confirm", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						orderId: parsedOrderId,
						paymentId: parsedPaymentId,
						transactionId,
					}),
				});

				let payload: any = null;
				try {
					payload = await res.json();
				} catch {
					payload = null;
				}

				if (res.ok && payload && payload.ok === true) {
					setConfirmMessage(typeof payload.message === "string" ? payload.message : "결제 확인이 완료되었습니다.");
					setConfirmErrors(null);
					setConfirmedPaymentId(payload.paymentId ?? parsedPaymentId);
					// 성공 시 sessionStorage 정리
					try {
						if (typeof window !== "undefined" && window.sessionStorage) {
							window.sessionStorage.removeItem("pendingPaymentId");
							window.sessionStorage.removeItem("pendingOrderId");
						}
					} catch {
						// 정리 실패는 무시
					}
					return;
				}

				if (res.ok && payload && payload.ok === false) {
					setConfirmMessage(typeof payload.message === "string" ? payload.message : "결제 확인에 실패했습니다.");
					setConfirmErrors(payload.errors ?? null);
					setConfirmedPaymentId(null);
					return;
				}

				// non-2xx or unparsable
				if (payload && typeof payload === "object") {
					setConfirmMessage(typeof payload.message === "string" ? payload.message : "결제 확인 처리 중 오류가 발생했습니다.");
					setConfirmErrors(payload.errors ?? null);
					setConfirmedPaymentId(null);
				} else {
					setConfirmMessage("결제 확인 처리 중 오류가 발생했습니다.");
					setConfirmErrors(null);
					setConfirmedPaymentId(null);
				}
			} catch {
				setConfirmMessage("결제 확인 요청 중 오류가 발생했습니다.");
				setConfirmErrors(null);
				setConfirmedPaymentId(null);
			} finally {
				setIsConfirming(false);
			}
		})();
	}, [paymentKey, orderId, amount]);

	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 8 }}>결제 확인</h1>
			{isConfirming ? <p style={{ marginBottom: 8 }}>결제 확인 중...</p> : null}
			{confirmMessage ? <p style={{ marginBottom: 8 }}>{confirmMessage}</p> : null}
			{confirmErrors ? (
				<pre style={{ marginTop: 0, color: "#b00020", whiteSpace: "pre-wrap" }}>
					{JSON.stringify(confirmErrors, null, 2)}
				</pre>
			) : null}
			{confirmedPaymentId ? (
				<p style={{ marginTop: 4, color: "#2e7d32" }}>confirmedPaymentId: {String(confirmedPaymentId)}</p>
			) : null}
		</div>
	);
}

