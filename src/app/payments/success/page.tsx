import type { ReactElement } from "react";

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

	// 서버 컴포넌트: storage 접근 금지. 하위 클라이언트 컴포넌트로 전달만 한다.
	const SuccessClient = require("./SuccessClient").default as (props: {
		paymentKey: string | null;
		orderId: string | null;
		amount: string | null;
	}) => ReactElement;

	return (
		<SuccessClient paymentKey={paymentKey} orderId={orderId} amount={amount} />
	);
}

