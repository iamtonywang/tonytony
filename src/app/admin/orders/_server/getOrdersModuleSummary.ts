import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type OrdersModuleSummary = {
	total: number;
	pending: number;
	paid: number;
	preparing: number;
	shipped: number;
	completed: number;
	cancelled: number;
	refunded: number;
};

const STATUSES = ["pending", "paid", "preparing", "shipped", "completed", "cancelled", "refunded"] as const;

export async function getOrdersModuleSummary(): Promise<OrdersModuleSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const [totalRes, ...statusRes] = await Promise.all([
		supabase.from("orders").select("*", { count: "exact", head: true }),
		...STATUSES.map((s) =>
			supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", s),
		),
	]);

	const total = totalRes.count ?? 0;
	const counts = Object.fromEntries(STATUSES.map((s, i) => [s, statusRes[i]?.count ?? 0])) as Record<
		(typeof STATUSES)[number],
		number
	>;

	return {
		total,
		pending: counts.pending,
		paid: counts.paid,
		preparing: counts.preparing,
		shipped: counts.shipped,
		completed: counts.completed,
		cancelled: counts.cancelled,
		refunded: counts.refunded,
	};
}
