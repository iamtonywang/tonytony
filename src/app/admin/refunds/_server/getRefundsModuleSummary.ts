import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type RefundsModuleSummary = {
	total: number;
	requested: number;
	approved: number;
	rejected: number;
	completed: number;
};

const STATUSES = ["requested", "approved", "rejected", "completed"] as const;

export async function getRefundsModuleSummary(): Promise<RefundsModuleSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const [totalRes, ...statusRes] = await Promise.all([
		supabase.from("refunds").select("*", { count: "exact", head: true }),
		...STATUSES.map((s) =>
			supabase.from("refunds").select("*", { count: "exact", head: true }).eq("refund_status", s),
		),
	]);

	const total = totalRes.count ?? 0;
	const counts = Object.fromEntries(STATUSES.map((s, i) => [s, statusRes[i]?.count ?? 0])) as Record<
		(typeof STATUSES)[number],
		number
	>;

	return {
		total,
		requested: counts.requested,
		approved: counts.approved,
		rejected: counts.rejected,
		completed: counts.completed,
	};
}
