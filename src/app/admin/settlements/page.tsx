import SettlementSummary from "./_components/SettlementSummary";
import SettlementsModuleClient from "./_components/SettlementsModuleClient";
import { getSettlementsModuleSummary } from "./_server/getSettlementsModuleSummary";

export default async function Page() {
	const summary = await getSettlementsModuleSummary();

	return (
		<div style={{ maxWidth: 1080, margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>Settlements Module</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>
				정산 요청 통계 · 목록(20건 단위) · 상세(선택 시 조회)
			</p>
			<SettlementSummary data={summary} />
			<SettlementsModuleClient />
		</div>
	);
}
