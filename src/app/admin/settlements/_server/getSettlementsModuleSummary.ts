import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type SettlementsModuleSummary = {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
	paid: number;
};

const STATUSES = ["pending", "approved", "rejected", "paid"] as const;

export async function getSettlementsModuleSummary(): Promise<SettlementsModuleSummary> {
	const supabase = await getSupabaseServerReadonlyClient();

	const [totalRes, ...statusRes] = await Promise.all([
		supabase.from("partner_settlement_requests").select("*", { count: "exact", head: true }),
		...STATUSES.map((s) =>
			supabase.from("partner_settlement_requests").select("*", { count: "exact", head: true }).eq("request_status", s),
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
		approved: counts.approved,
		rejected: counts.rejected,
		paid: counts.paid,
	};
}
