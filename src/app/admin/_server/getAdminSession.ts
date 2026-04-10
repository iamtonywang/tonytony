import "server-only";

import { cache } from "react";

import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";

export type AdminSession = {
	authenticated: boolean;
	isAdmin: boolean;
	adminRole: string | null;
	loginId: string | null;
};

/**
 * AdminLayout guard: delegates to getHeaderSession() only (no extra auth.getUser).
 * Wrapped in React.cache so repeated calls in the same RSC request share work with RootLayout.
 */
export const getAdminSession = cache(async function getAdminSession(): Promise<AdminSession> {
	const headerSession = await getHeaderSession();

	return {
		authenticated: headerSession.authenticated,
		isAdmin: headerSession.isAdmin,
		adminRole: null,
		loginId: headerSession.loginId,
	};
});

