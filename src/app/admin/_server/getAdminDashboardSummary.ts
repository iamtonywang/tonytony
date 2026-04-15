import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminDashboardSummary = {
	visits: {
		available: boolean;
		todayVisitors: number;
		last7DaysUniqueVisitors: number;
		totalLabel: string;
		subLabel: string;
	};
	signups: {
		totalUsers: number;
		recent7Days: number;
	};
	sales: {
		totalOrders: number;
		pendingOrders: number;
	};
	refunds: {
		pendingRefunds: number;
		approvedRefunds: number;
	};
	settlements: {
		requestedCount: number;
		payableCount: number;
	};
	alerts: {
		totalPendingCount: number;
		breakdownLabel: string;
	};
};

type VisitStatsRow = {
	todayVisitors?: number;
	last7DaysUniqueVisitors?: number;
};

/**
 * 단일 진입점에서 /admin 메인 대시보드용 요약만 병렬 조회합니다.
 */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const since = new Date();
	since.setDate(since.getDate() - 7);
	const sinceIso = since.toISOString();

	const [
		visitStatsRes,
		totalUsersRes,
		recentUsersRes,
		totalOrdersRes,
		pendingOrdersRes,
		refundRequestedRes,
		refundApprovedRes,
		settlementPendingRes,
		settlementApprovedRes,
	] = await Promise.all([
		supabase.rpc("admin_dashboard_site_visit_stats"),
		supabase.from("users").select("*", { count: "exact", head: true }),
		supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", sinceIso),
		supabase.from("orders").select("*", { count: "exact", head: true }),
		supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "pending"),
		supabase.from("refunds").select("*", { count: "exact", head: true }).eq("refund_status", "requested"),
		supabase.from("refunds").select("*", { count: "exact", head: true }).eq("refund_status", "approved"),
		supabase
			.from("partner_settlement_requests")
			.select("*", { count: "exact", head: true })
			.eq("request_status", "pending"),
		supabase
			.from("partner_settlement_requests")
			.select("*", { count: "exact", head: true })
			.eq("request_status", "approved"),
	]);

	let todayVisitors = 0;
	let last7Unique = 0;
	let visitsAvailable = false;

	if (!visitStatsRes.error && visitStatsRes.data != null) {
		const row = visitStatsRes.data as VisitStatsRow;
		todayVisitors = typeof row.todayVisitors === "number" ? row.todayVisitors : 0;
		last7Unique =
			typeof row.last7DaysUniqueVisitors === "number" ? row.last7DaysUniqueVisitors : 0;
		visitsAvailable = true;
	}

	const totalUsers = totalUsersRes.count ?? 0;
	const recent7Days = recentUsersRes.count ?? 0;
	const totalOrders = totalOrdersRes.count ?? 0;
	const pendingOrders = pendingOrdersRes.count ?? 0;
	const pendingRefunds = refundRequestedRes.count ?? 0;
	const approvedRefunds = refundApprovedRes.count ?? 0;
	const requestedCount = settlementPendingRes.count ?? 0;
	const payableCount = settlementApprovedRes.count ?? 0;

	const totalPendingCount = pendingOrders + pendingRefunds + requestedCount;
	const breakdownLabel = `주문 대기 ${pendingOrders} · 환불 요청 ${pendingRefunds} · 정산 접수 대기 ${requestedCount}`;

	return {
		visits: {
			available: visitsAvailable,
			todayVisitors,
			last7DaysUniqueVisitors: last7Unique,
			totalLabel: String(todayVisitors),
			subLabel: visitsAvailable
				? `최근 7일 고유 방문 ${last7Unique}명 (KST)`
				: "방문 통계를 불러오지 못했습니다. DB 마이그레이션 적용 여부를 확인해 주세요.",
		},
		signups: {
			totalUsers,
			recent7Days,
		},
		sales: {
			totalOrders,
			pendingOrders,
		},
		refunds: {
			pendingRefunds,
			approvedRefunds,
		},
		settlements: {
			requestedCount,
			payableCount,
		},
		alerts: {
			totalPendingCount,
			breakdownLabel,
		},
	};
}
