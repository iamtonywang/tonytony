import type { CSSProperties } from "react";

import type { OrdersModuleSummary } from "../_server/getOrdersModuleSummary";

type Props = {
	data: OrdersModuleSummary;
};

export default function OrderSummary({ data }: Props) {
	const cardStyle: CSSProperties = {
		border: "1px solid rgba(255,255,255,0.25)",
		padding: 10,
		borderRadius: 4,
		textAlign: "center",
	};
	const label = (s: string) => (
		<div style={{ opacity: 0.85, fontSize: 11 }}>{s}</div>
	);
	return (
		<section style={{ marginBottom: 20 }}>
			<h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>주문 통계 (order_status)</h2>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
					gap: 8,
				}}
			>
				<div style={cardStyle}>
					{label("전체")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.total}</div>
				</div>
				<div style={cardStyle}>
					{label("pending")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.pending}</div>
				</div>
				<div style={cardStyle}>
					{label("paid")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.paid}</div>
				</div>
				<div style={cardStyle}>
					{label("preparing")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.preparing}</div>
				</div>
				<div style={cardStyle}>
					{label("shipped")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.shipped}</div>
				</div>
				<div style={cardStyle}>
					{label("completed")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.completed}</div>
				</div>
				<div style={cardStyle}>
					{label("cancelled")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.cancelled}</div>
				</div>
				<div style={cardStyle}>
					{label("refunded")}
					<div style={{ fontSize: 18, marginTop: 4 }}>{data.refunded}</div>
				</div>
			</div>
		</section>
	);
}
