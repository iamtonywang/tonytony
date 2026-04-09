import "server-only";

import { requireActiveAdmin } from "./requireActiveAdmin";

export type UsersModuleSummary = {
	total: number;
	active: number;
	blocked: number;
	withdrawn: number;
	recentJoined7d: number;
};

export async function getUsersModuleSummary(): Promise<UsersModuleSummary> {
	const empty: UsersModuleSummary = {
		total: 0,
		active: 0,
		blocked: 0,
		withdrawn: 0,
		recentJoined7d: 0,
	};

	const r = await requireActiveAdmin();
	if (!r.ok) {
		return empty;
	}
	const { supabase } = r;
	const since = new Date();
	since.setDate(since.getDate() - 7);
	const sinceIso = since.toISOString();

	const [totalRes, activeRes, blockedRes, withdrawnRes, recentRes] = await Promise.all([
		supabase.from("users").select("*", { count: "exact", head: true }),
		supabase.from("users").select("*", { count: "exact", head: true }).eq("user_status", "active"),
		supabase.from("users").select("*", { count: "exact", head: true }).eq("user_status", "blocked"),
		supabase.from("users").select("*", { count: "exact", head: true }).eq("user_status", "withdrawn"),
		supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", sinceIso),
	]);

	return {
		total: totalRes.count ?? 0,
		active: activeRes.count ?? 0,
		blocked: blockedRes.count ?? 0,
		withdrawn: withdrawnRes.count ?? 0,
		recentJoined7d: recentRes.count ?? 0,
	};
}
