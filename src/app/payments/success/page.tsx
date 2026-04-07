// Toss Payments 성공 리다이렉트 진입 페이지
// - searchParams 로 paymentKey / orderId / amount 를 수신한다.
// - 정책: Toss 의 paymentKey 를 우리 시스템의 transactionId 로 사용한다.
// - 주의: searchParams 는 단일 문자열만 허용하며 배열 값은 무효 처리한다.
// - 현재 단계에서는 paymentId 확보 경로가 없으므로 /api/payments/confirm 호출을 하지 않는다.

type SearchParams = {
	paymentKey?: string | string[] | undefined;
	orderId?: string | string[] | undefined;
	amount?: string | string[] | undefined;
};

function normalizeSingle(param: string | string[] | undefined): string | null {
	if (typeof param === "undefined" || param === null) return null;
	if (Array.isArray(param)) return null; // 배열 값은 무효 처리(단일 문자열만 허용)
	const t = param.trim();
	return t.length > 0 ? t : null;
}

export default function Page({ searchParams }: { searchParams?: SearchParams }) {
	const paymentKey = normalizeSingle(searchParams?.paymentKey);
	const orderId = normalizeSingle(searchParams?.orderId);
	const amount = normalizeSingle(searchParams?.amount);

	// 정책 고정:
	// - transactionId = paymentKey
	// - orderId/amount 를 transactionId 로 사용하지 않는다.
	const transactionId = paymentKey ?? null;

	// 화면 렌더 규칙:
	// A) paymentKey 또는 orderId 누락
	if (!paymentKey || !orderId) {
		return (
			<div style={{ padding: 24 }}>
				<h1 style={{ marginBottom: 8 }}>결제 확인 정보를 받지 못했습니다</h1>
				<p style={{ marginBottom: 8 }}>
					paymentKey 또는 orderId가 없어 확인을 진행할 수 없습니다.
				</p>
				{amount ? <p style={{ color: "#666" }}>amount: {amount}</p> : null}
			</div>
		);
	}

	// B) paymentKey / orderId 는 있으나 paymentId 미확보 상태
	// 현재 단계에서는 success 페이지 단독으로 paymentId를 알 수 없으므로 confirm 호출 금지
	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 8 }}>결제 승인 정보는 도착했습니다</h1>
			<p style={{ marginBottom: 8 }}>
				paymentId가 아직 연결되지 않아 최종 결제 확인을 진행할 수 없습니다.
			</p>
			<div style={{ marginTop: 12 }}>
				<p style={{ margin: 0 }}>orderId: {orderId}</p>
				<p style={{ margin: 0 }}>paymentKey(transactionId): {transactionId}</p>
				{amount ? <p style={{ margin: 0 }}>amount: {amount}</p> : null}
			</div>
			{/* TODO: 추후 paymentId 전달 구조가 연결되면 /api/payments/confirm 호출을 이 페이지에서 수행한다. */}
		</div>
	);
}

