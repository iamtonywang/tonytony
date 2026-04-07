import type { PartnerPageSummary } from "../types";

type Props = {
	summary: PartnerPageSummary | null;
};

export default function PartnerSummarySection({ summary }: Props) {
	const formatCurrency = (v: number | null | undefined) => {
		if (v === null || v === undefined) return "-";
		return `₩${v.toLocaleString("ko-KR")}`;
	};
	const formatPoint = (v: number | null | undefined) => {
		if (v === null || v === undefined) return "-";
		return `${v.toLocaleString("ko-KR")}P`;
	};

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>요약</h2>
			<div>
				<p style={{ margin: 0 }}>파트너 상태: {summary?.partnerStatus ?? "-"}</p>
				<p style={{ margin: 0 }}>추천인 코드: {summary?.partnerCode ?? "-"}</p>
				<p style={{ margin: 0 }}>오늘 판매(총액): {formatCurrency(summary?.todaySalesAmount?.gross)}</p>
				<p style={{ margin: 0 }}>오늘 판매(내 수익 10%): {formatCurrency(summary?.todaySalesAmount?.commission)}</p>
				<p style={{ margin: 0 }}>오늘 포인트: {formatPoint(summary?.todaySalesAmount?.point)}</p>
				<p style={{ margin: 0 }}>월 판매(총액): {formatCurrency(summary?.monthSalesAmount?.gross)}</p>
				<p style={{ margin: 0 }}>월 판매(내 수익 10%): {formatCurrency(summary?.monthSalesAmount?.commission)}</p>
				<p style={{ margin: 0 }}>월 포인트: {formatPoint(summary?.monthSalesAmount?.point)}</p>
				<p style={{ margin: 0 }}>
					정산 대기 금액(커미션): {formatCurrency(summary?.waitingSettlementAmount?.commission)}
				</p>
				<p style={{ margin: 0 }}>
					정산 가능 금액(커미션): {formatCurrency(summary?.availableSettlementAmount?.commission)}
				</p>
				<p style={{ margin: 0 }}>계좌 보유 여부: {summary?.hasBankAccount ? "예" : "아니요"}</p>
			</div>
			<div style={{ marginTop: 12 }}>
				<p style={{ margin: 0 }}>login_id: {summary?.loginId ?? "-"}</p>
				<p style={{ margin: 0 }}>이름: {summary?.realName ?? "-"}</p>
				<p style={{ margin: 0 }}>연락처: {summary?.phone ?? "-"}</p>
				<p style={{ margin: 0 }}>이메일: {summary?.email ?? "-"}</p>
			</div>
			<div style={{ marginTop: 12 }}>
				<p style={{ margin: "0 0 4px 0" }}>상품별 판매 현황</p>
				{summary?.productSalesSummary === null ? (
					<p style={{ margin: 0 }}>-</p>
				) : summary?.productSalesSummary && summary.productSalesSummary.length > 0 ? (
					<div style={{ display: "grid", gap: 6 }}>
						{summary.productSalesSummary.map((item, idx) => (
							<article key={`${item.productLabel ?? "product"}-${idx}`} style={{ border: "1px solid #ddd", padding: 8 }}>
								<p style={{ margin: "0 0 4px 0" }}>상품: {item.productLabel ?? "-"}</p>
								<p style={{ margin: "0 0 4px 0" }}>수량: {item.quantity ?? "-"}</p>
								<p style={{ margin: "0 0 4px 0" }}>총판매금액: {formatCurrency(item.gross)}</p>
								<p style={{ margin: 0 }}>내 수익(10%): {formatCurrency(item.commission)}</p>
							</article>
						))}
					</div>
				) : (
					<p style={{ margin: 0 }}>-</p>
				)}
			</div>
		</section>
	);
}

