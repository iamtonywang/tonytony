import type { CSSProperties } from "react";
import Link from "next/link";

import { getAdminDashboardSummary } from "./_server/getAdminDashboardSummary";

export default async function Page() {
	const summary = await getAdminDashboardSummary();

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

	const statCardStyle: CSSProperties = {
		border: "1px solid rgba(255,255,255,0.2)",
		padding: "14px 16px",
		borderRadius: 8,
		textAlign: "center" as const,
	};

	const statTitleStyle = {
		fontSize: 14,
		display: "block",
		marginBottom: 8,
		color: "rgba(255,255,255,0.95)",
	};

	const statPrimaryStyle = {
		fontSize: 28,
		fontWeight: 600 as const,
		lineHeight: 1.2,
		color: "#ffffff",
	};

	const statSecondaryStyle = {
		fontSize: 12,
		lineHeight: 1.45,
		marginTop: 8,
		color: "rgba(255,255,255,0.78)",
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

			<div
				style={{
					marginTop: 24,
					display: "grid",
					gridTemplateColumns: "1fr",
					gap: 12,
					maxWidth: 480,
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				<div style={statCardStyle}>
					<strong style={statTitleStyle}>방문 통계</strong>
					<div style={statPrimaryStyle}>{summary.visits.totalLabel}</div>
					<div style={statSecondaryStyle}>{summary.visits.subLabel}</div>
				</div>

				<div style={statCardStyle}>
					<strong style={statTitleStyle}>회원가입 통계</strong>
					<div style={statPrimaryStyle}>{summary.signups.totalUsers}</div>
					<div style={statSecondaryStyle}>최근 7일 가입 {summary.signups.recent7Days}명</div>
				</div>

				<div style={statCardStyle}>
					<strong style={statTitleStyle}>판매 요약</strong>
					<div style={statPrimaryStyle}>{summary.sales.totalOrders}</div>
					<div style={statSecondaryStyle}>결제 대기(pending) {summary.sales.pendingOrders}건</div>
				</div>

				<div style={statCardStyle}>
					<strong style={statTitleStyle}>환불 요약</strong>
					<div style={statPrimaryStyle}>{summary.refunds.pendingRefunds}</div>
					<div style={statSecondaryStyle}>요청(requested) · 승인(approved) {summary.refunds.approvedRefunds}건</div>
				</div>

				<div style={statCardStyle}>
					<strong style={statTitleStyle}>정산 요약</strong>
					<div style={statPrimaryStyle}>{summary.settlements.requestedCount}</div>
					<div style={statSecondaryStyle}>
						접수 대기(pending) · 승인·지급 단계(approved) {summary.settlements.payableCount}건
					</div>
				</div>

				<div style={statCardStyle}>
					<strong style={statTitleStyle}>운영 경고/대기 건수</strong>
					<div style={statPrimaryStyle}>{summary.alerts.totalPendingCount}</div>
					<div style={statSecondaryStyle}>{summary.alerts.breakdownLabel}</div>
				</div>
			</div>
		</div>
	);
}
