import "server-only";

import { getAdminSession } from "@/app/admin/_server/getAdminSession";
import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type ActiveAdminReadonlyClient = Awaited<ReturnType<typeof getSupabaseServerReadonlyClient>>;

export type RequireAdminFailureReason = "unauthorized" | "user_not_found" | "forbidden";

export async function requireActiveAdminReadonly(): Promise<
	{ ok: true; supabase: ActiveAdminReadonlyClient } | { ok: false; reason: RequireAdminFailureReason }
> {
	const session = await getAdminSession();
	if (!session.authenticated) {
		return { ok: false, reason: "unauthorized" };
	}
	if (!session.isAdmin) {
		return { ok: false, reason: "forbidden" };
	}
	const supabase = await getSupabaseServerReadonlyClient();
	return { ok: true, supabase };
}
