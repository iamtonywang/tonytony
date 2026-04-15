import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminDashboardSummary = {
	visits: {
		available: boolean;
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

/**
 * 단일 진입점에서 /admin 메인 대시보드용 요약만 병렬 조회합니다.
 * (방문 로그 테이블 없음 → visits 는 문구만 반환)
 */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const since = new Date();
	since.setDate(since.getDate() - 7);
	const sinceIso = since.toISOString();

	const [
		totalUsersRes,
		recentUsersRes,
		totalOrdersRes,
		pendingOrdersRes,
		refundRequestedRes,
		refundApprovedRes,
		settlementPendingRes,
		settlementApprovedRes,
	] = await Promise.all([
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
			available: false,
			totalLabel: "집계 준비중",
			subLabel: "방문 로그 미구현",
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
