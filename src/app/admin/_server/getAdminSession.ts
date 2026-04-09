import "server-only";

import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";

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
	const headerSession = await getHeaderSession();

	return {
		authenticated: headerSession.authenticated,
		isAdmin: headerSession.isAdmin,
		adminRole: null,
		loginId: headerSession.loginId,
	};
}

