import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminSession = {
	authenticated: boolean;
	isAdmin: boolean;
	adminRole: string | null;
	loginId: string | null;
};

/**
 * Minimal admin session lookup for AdminLayout guard.
 * - Reads current auth user
 * - Resolves users.id and login_id
 * - Resolves admins row with admin_status='active'
 * - Returns only safe display fields (no UUIDs, no bigint PK exposure)
 */
export async function getAdminSession(): Promise<AdminSession> {
	const supabase = await getSupabaseServerReadonlyClient();

	const { data: authData } = await supabase.auth.getUser();
	if (!authData?.user) {
		return {
			authenticated: false,
			isAdmin: false,
			adminRole: null,
			loginId: null,
		};
	}

	const { data: usersRows } = await supabase
		.from("users")
		.select("id, login_id")
		.eq("auth_user_id", authData.user.id)
		.limit(1);
	const userRow =
		Array.isArray(usersRows) && usersRows.length === 1
			? (usersRows[0] as { id: number; login_id: string | null })
			: null;

	if (!userRow || typeof userRow.id !== "number") {
		return {
			authenticated: true,
			isAdmin: false,
			adminRole: null,
			loginId: null,
		};
	}

	const { data: adminRows } = await supabase
		.from("admins")
		.select("admin_role, admin_status")
		.eq("user_id", userRow.id)
		.eq("admin_status", "active")
		.limit(1);
	const admin =
		Array.isArray(adminRows) && adminRows.length === 1
			? (adminRows[0] as { admin_role: string | null; admin_status: string | null })
			: null;

	return {
		authenticated: true,
		isAdmin: Boolean(admin),
		adminRole: admin?.admin_role ?? null,
		loginId: userRow.login_id ?? null,
	};
}

