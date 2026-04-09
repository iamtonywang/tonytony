import { getOrdersModuleSummary } from "./_server/getOrdersModuleSummary";
import OrderSummary from "./_components/OrderSummary";
import OrdersModuleClient from "./_components/OrdersModuleClient";

export default async function Page() {
	const summary = await getOrdersModuleSummary();

	return (
		<div style={{ maxWidth: 1080, margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>Orders Module</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>
				주문 통계 · 목록(20건 단위) · 상세(선택 시 조회)
			</p>
			<OrderSummary data={summary} />
			<OrdersModuleClient />
		</div>
	);
}
