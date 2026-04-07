import type { PartnerPageSummary } from "../types";

type Props = {
	summary: PartnerPageSummary | null;
};

export default function PartnerSummarySection({ summary }: Props) {
	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>요약</h2>
			<div>
				<p style={{ margin: 0 }}>파트너 상태: {summary?.partnerStatus ?? "-"}</p>
				<p style={{ margin: 0 }}>오늘 판매: {summary?.todaySalesAmount ?? "-"}</p>
				<p style={{ margin: 0 }}>월 판매: {summary?.monthSalesAmount ?? "-"}</p>
				<p style={{ margin: 0 }}>정산 가능 금액: {summary?.availableSettlementAmount ?? "-"}</p>
				<p style={{ margin: 0 }}>계좌 보유 여부: {summary?.hasBankAccount ? "예" : "아니요"}</p>
			</div>
			<div style={{ marginTop: 12 }}>
				<p style={{ margin: 0 }}>login_id: {summary?.loginId ?? "-"}</p>
				<p style={{ margin: 0 }}>이름: {summary?.realName ?? "-"}</p>
				<p style={{ margin: 0 }}>연락처: {summary?.phone ?? "-"}</p>
				<p style={{ margin: 0 }}>이메일: {summary?.email ?? "-"}</p>
			</div>
		</section>
	);
}

