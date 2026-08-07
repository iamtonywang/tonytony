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

type DashboardSummaryRpcRow = {
	todayVisitors?: unknown;
	last7DaysUniqueVisitors?: unknown;
	totalUsers?: unknown;
	recent7Days?: unknown;
	totalOrders?: unknown;
	pendingOrders?: unknown;
	pendingRefunds?: unknown;
	approvedRefunds?: unknown;
	requestedCount?: unknown;
	payableCount?: unknown;
};

type SupabaseLikeError = {
	code?: string;
	message?: string;
};

function toNonNegNumber(v: unknown): number {
	if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
		return Math.floor(v);
	}
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		if (Number.isFinite(n) && n >= 0) return Math.floor(n);
	}
	return 0;
}

function buildSummary(parts: {
	visitsAvailable: boolean;
	todayVisitors: number;
	last7Unique: number;
	totalUsers: number;
	recent7Days: number;
	totalOrders: number;
	pendingOrders: number;
	pendingRefunds: number;
	approvedRefunds: number;
	requestedCount: number;
	payableCount: number;
}): AdminDashboardSummary {
	const totalPendingCount = parts.pendingOrders + parts.pendingRefunds + parts.requestedCount;
	const breakdownLabel = `주문 대기 ${parts.pendingOrders} · 환불 요청 ${parts.pendingRefunds} · 정산 접수 대기 ${parts.requestedCount}`;

	return {
		visits: {
			available: parts.visitsAvailable,
			todayVisitors: parts.todayVisitors,
			last7DaysUniqueVisitors: parts.last7Unique,
			totalLabel: String(parts.todayVisitors),
			subLabel: parts.visitsAvailable
				? `최근 7일 고유 방문 ${parts.last7Unique}명 (KST)`
				: "방문 통계를 불러오지 못했습니다. DB 마이그레이션 적용 여부를 확인해 주세요.",
		},
		signups: {
			totalUsers: parts.totalUsers,
			recent7Days: parts.recent7Days,
		},
		sales: {
			totalOrders: parts.totalOrders,
			pendingOrders: parts.pendingOrders,
		},
		refunds: {
			pendingRefunds: parts.pendingRefunds,
			approvedRefunds: parts.approvedRefunds,
		},
		settlements: {
			requestedCount: parts.requestedCount,
			payableCount: parts.payableCount,
		},
		alerts: {
			totalPendingCount,
			breakdownLabel,
		},
	};
}

function unavailableSummary(): AdminDashboardSummary {
	return buildSummary({
		visitsAvailable: false,
		todayVisitors: 0,
		last7Unique: 0,
		totalUsers: 0,
		recent7Days: 0,
		totalOrders: 0,
		pendingOrders: 0,
		pendingRefunds: 0,
		approvedRefunds: 0,
		requestedCount: 0,
		payableCount: 0,
	});
}

function isMissingRpcError(error: SupabaseLikeError | null | undefined): boolean {
	if (!error) return false;
	const code = typeof error.code === "string" ? error.code : "";
	const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
	if (code === "PGRST202" || code === "42883") return true;
	if (message.includes("could not find the function")) return true;
	if (message.includes("admin_dashboard_summary") && message.includes("does not exist")) return true;
	return false;
}

/**
 * Pre-migration path: 1 visit RPC + 8 exact counts (unchanged semantics).
 */
async function getAdminDashboardSummaryLegacy(
	supabase: Awaited<ReturnType<typeof getSupabaseServerReadonlyClient>>,
): Promise<AdminDashboardSummary> {
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

	return buildSummary({
		visitsAvailable,
		todayVisitors,
		last7Unique,
		totalUsers: totalUsersRes.count ?? 0,
		recent7Days: recentUsersRes.count ?? 0,
		totalOrders: totalOrdersRes.count ?? 0,
		pendingOrders: pendingOrdersRes.count ?? 0,
		pendingRefunds: refundRequestedRes.count ?? 0,
		approvedRefunds: refundApprovedRes.count ?? 0,
		requestedCount: settlementPendingRes.count ?? 0,
		payableCount: settlementApprovedRes.count ?? 0,
	});
}

/**
 * /admin 메인 대시보드 요약.
 * Prefer single admin_dashboard_summary RPC; if missing, legacy 9-call path.
 */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const { data, error } = await supabase.rpc("admin_dashboard_summary");

	if (error) {
		if (isMissingRpcError(error)) {
			return getAdminDashboardSummaryLegacy(supabase);
		}
		console.error(
			"[admin-dashboard-summary] rpc_failed",
			JSON.stringify({ code: typeof error.code === "string" ? error.code : null }),
		);
		return unavailableSummary();
	}

	if (data == null || typeof data !== "object" || Array.isArray(data)) {
		console.error("[admin-dashboard-summary] rpc_failed", JSON.stringify({ code: "invalid_payload" }));
		return unavailableSummary();
	}

	const row = data as DashboardSummaryRpcRow;

	return buildSummary({
		visitsAvailable: true,
		todayVisitors: toNonNegNumber(row.todayVisitors),
		last7Unique: toNonNegNumber(row.last7DaysUniqueVisitors),
		totalUsers: toNonNegNumber(row.totalUsers),
		recent7Days: toNonNegNumber(row.recent7Days),
		totalOrders: toNonNegNumber(row.totalOrders),
		pendingOrders: toNonNegNumber(row.pendingOrders),
		pendingRefunds: toNonNegNumber(row.pendingRefunds),
		approvedRefunds: toNonNegNumber(row.approvedRefunds),
		requestedCount: toNonNegNumber(row.requestedCount),
		payableCount: toNonNegNumber(row.payableCount),
	});
}
