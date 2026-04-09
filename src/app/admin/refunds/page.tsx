import { getRefundsModuleSummary } from "./_server/getRefundsModuleSummary";
import RefundSummary from "./_components/RefundSummary";
import RefundsModuleClient from "./_components/RefundsModuleClient";

export default async function Page() {
	const summary = await getRefundsModuleSummary();

	return (
		<div style={{ maxWidth: 1080, margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>Refunds Module</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>
				환불 통계 · 목록(20건 단위) · 상세(선택 시 조회)
			</p>
			<RefundSummary data={summary} />
			<RefundsModuleClient />
		</div>
	);
}
