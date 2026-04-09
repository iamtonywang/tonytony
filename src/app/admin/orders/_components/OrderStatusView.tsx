type Props = {
	orderStatus: string;
	paymentStatus: string;
};

export default function OrderStatusView({ orderStatus, paymentStatus }: Props) {
	return (
		<div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", fontSize: 13 }}>
			<span style={{ opacity: 0.85 }}>주문상태</span>
			<span>{orderStatus}</span>
			<span style={{ opacity: 0.85 }}>결제상태</span>
			<span>{paymentStatus}</span>
		</div>
	);
}
