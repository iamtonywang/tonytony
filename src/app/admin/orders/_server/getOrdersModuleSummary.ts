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

	const { data } = await supabase.from("orders").select("order_status");
	const rows = Array.isArray(data) ? (data as Array<{ order_status: string | null }>) : [];
	const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<(typeof STATUSES)[number], number>;
	for (const row of rows) {
		const status = row.order_status;
		if (typeof status !== "string") continue;
		if (status in counts) {
			counts[status as (typeof STATUSES)[number]] += 1;
		}
	}
	const total = rows.length;

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
