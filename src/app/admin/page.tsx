import Link from "next/link";

export default async function Page() {
	const statCardStyle = {
		border: "1px solid rgba(255,255,255,0.2)",
		padding: 8,
		minHeight: 72,
	};

	const statTitleStyle = {
		fontSize: 14,
	};

	const statTextStyle = {
		marginTop: 6,
		opacity: 0.8,
		fontSize: 13,
	};

	return (
		<div style={{ textAlign: "center" }}>
			<h1 style={{ margin: "12px 0 16px" }}>Admin Dashboard</h1>

			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
				<Link href="/admin/users">users</Link>
				<Link href="/admin/products">products</Link>
				<Link href="/admin/orders">orders</Link>
				<Link href="/admin/refunds">refunds</Link>
				<Link href="/admin/partners">partners</Link>
				<Link href="/admin/settlements">settlements</Link>
				<Link href="/admin/boards">boards</Link>
				<Link href="/admin/metrics">metrics</Link>
			</div>

			<div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>방문 통계</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>회원가입 통계</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>판매 요약</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>환불 요약</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>정산 요약</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>운영 경고/대기 건수</strong>
					<p style={statTextStyle}>placeholder</p>
				</div>
			</div>
		</div>
	);
}

