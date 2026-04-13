import Link from "next/link";

export default async function Page() {
	const moduleLinkStyle = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "10px 14px",
		border: "1px solid rgba(255,255,255,0.1)",
		borderRadius: 10,
		fontSize: 14,
		cursor: "pointer",
		transition: "all 0.2s ease",
		textDecoration: "none",
		color: "rgba(255,255,255,0.92)",
	};

	const statCardStyle = {
		border: "1px solid rgba(255,255,255,0.2)",
		padding: 8,
		minHeight: 72,
	};

	const statTitleStyle = {
		fontSize: 14,
	};

	return (
		<div style={{ textAlign: "center" }}>
			<h1 style={{ margin: "12px 0 16px" }}>Admin Dashboard</h1>

			<style
				dangerouslySetInnerHTML={{
					__html: `
.admin-module-link:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
}
`,
				}}
			/>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
					gap: 10,
					maxWidth: 520,
					margin: "0 auto",
				}}
			>
				<Link href="/admin/users" className="admin-module-link" style={moduleLinkStyle}>
					users
				</Link>
				<Link href="/admin/products" className="admin-module-link" style={moduleLinkStyle}>
					products
				</Link>
				<Link href="/admin/orders" className="admin-module-link" style={moduleLinkStyle}>
					orders
				</Link>
				<Link href="/admin/refunds" className="admin-module-link" style={moduleLinkStyle}>
					refunds
				</Link>
				<Link href="/admin/partners" className="admin-module-link" style={moduleLinkStyle}>
					partners
				</Link>
				<Link href="/admin/settlements" className="admin-module-link" style={moduleLinkStyle}>
					settlements
				</Link>
			</div>

			<div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>방문 통계</strong>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>회원가입 통계</strong>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>판매 요약</strong>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>환불 요약</strong>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>정산 요약</strong>
				</div>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>운영 경고/대기 건수</strong>
				</div>
			</div>
		</div>
	);
}

