import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type ActiveAdminReadonlyClient = Awaited<ReturnType<typeof getSupabaseServerReadonlyClient>>;

export type RequireAdminFailureReason = "unauthorized" | "user_not_found" | "forbidden";

export async function requireActiveAdminReadonly(): Promise<
	{ ok: true; supabase: ActiveAdminReadonlyClient } | { ok: false; reason: RequireAdminFailureReason }
> {
	const supabase = await getSupabaseServerReadonlyClient();
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return { ok: false, reason: "unauthorized" };
	}
	const { data: meRows } = await supabase.from("users").select("id").eq("auth_user_id", auth.user.id).limit(1);
	const me = Array.isArray(meRows) && meRows.length === 1 ? (meRows[0] as { id: number }) : null;
	if (!me) {
		return { ok: false, reason: "user_not_found" };
	}
	const { data: adminRows } = await supabase
		.from("admins")
		.select("id")
		.eq("user_id", me.id)
		.eq("admin_status", "active")
		.limit(1);
	if (!Array.isArray(adminRows) || adminRows.length !== 1) {
		return { ok: false, reason: "forbidden" };
	}
	return { ok: true, supabase };
}
