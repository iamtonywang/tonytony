import Link from "next/link";

export default async function Page() {
	return (
		<div style={{ textAlign: "center" }}>
			<h1 style={{ margin: "12px 0 16px" }}>Admin Dashboard</h1>
			<p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>
				관리자 대시보드 준비중입니다. 아래 모듈별 페이지에서 기능을 개별 구현합니다.
			</p>

			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
				<Link href="/admin/users">/admin/users</Link>
				<Link href="/admin/orders">/admin/orders</Link>
				<Link href="/admin/refunds">/admin/refunds</Link>
				<Link href="/admin/partners">/admin/partners</Link>
				<Link href="/admin/settlements">/admin/settlements</Link>
				<Link href="/admin/boards">/admin/boards</Link>
				<Link href="/admin/metrics">/admin/metrics</Link>
			</div>

			<div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>방문 통계</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>회원가입 통계</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>판매 요약</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>환불 요약</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>정산 요약</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
				<div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 12 }}>
					<strong>운영 경고/대기 건수</strong>
					<p style={{ marginTop: 8, opacity: 0.8 }}>placeholder</p>
				</div>
			</div>
		</div>
	);
}

