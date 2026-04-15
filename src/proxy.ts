import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getKstDateString } from "@/lib/metrics/kstDate";

/**
 * 익명 방문자 dedup 전용. Supabase auth / sb- / auth-token / refresh 계열과 이름·역할이 완전히 분리됨.
 * 로그인 인증에 사용하지 않음.
 */
const VISITOR_TOKEN_COOKIE = "tonytony_visitor_token";

function isRefreshTokenNotFoundError(error: unknown): boolean {
	const message =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: "";

	const lowered = message.toLowerCase();
	return lowered.includes("invalid refresh token") || lowered.includes("refresh token not found");
}

function getSupabaseAuthCookies(request: NextRequest): string[] {
	return request.cookies
		.getAll()
		.filter((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"))
		.map((cookie) => cookie.name);
}

/** 문서·페이지 요청만 방문 기록. 정적 에셋·미디어 경로는 제외. */
function isDocumentPathForVisitLog(pathname: string): boolean {
	if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
		return false;
	}
	if (pathname.startsWith("/landing-assets")) {
		return false;
	}
	const lower = pathname.toLowerCase();
	if (/\.(mp4|webp|jpe?g|png|gif|svg|ico|avif|woff2?|css|js|map)$/.test(lower)) {
		return false;
	}
	return true;
}

function shortRpcErrorBody(text: string, maxLen = 240): string {
	const s = text.replace(/\s+/g, " ").trim();
	if (s.length <= maxLen) return s;
	return `${s.slice(0, maxLen)}…`;
}

async function recordSiteVisitSafe(params: {
	supabaseUrl: string;
	serviceRoleKey: string;
	visitDate: string;
	authUserId: string | null;
	visitorToken: string | null;
	isAuthenticated: boolean;
	path: string;
	referrer: string | null;
}): Promise<void> {
	const { supabaseUrl, serviceRoleKey } = params;

	if (!serviceRoleKey.trim()) {
		console.warn("[proxy][visit] skipped: missing SUPABASE_SERVICE_ROLE_KEY");
		return;
	}

	try {
		const res = await fetch(`${supabaseUrl}/rest/v1/rpc/record_site_daily_visit`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: serviceRoleKey,
				Authorization: `Bearer ${serviceRoleKey}`,
			},
			body: JSON.stringify({
				p_visit_date: params.visitDate,
				p_auth_user_id: params.authUserId,
				p_visitor_token: params.visitorToken,
				p_is_authenticated: params.isAuthenticated,
				p_path: params.path,
				p_referrer: params.referrer,
			}),
		});

		if (!res.ok) {
			const errText = await res.text().catch(() => "");
			console.warn(
				"[proxy][visit] rpc failed",
				`status=${res.status} body=${shortRpcErrorBody(errText)}`,
			);
			return;
		}
	} catch (e) {
		console.error("[proxy][visit] record_site_daily_visit error", e);
	}
}

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	const existingVisitor = request.cookies.get(VISITOR_TOKEN_COOKIE)?.value ?? null;
	let visitorToken = existingVisitor;
	const isNewVisitorToken = !visitorToken;
	if (!visitorToken) {
		visitorToken = crypto.randomUUID();
		request.cookies.set(VISITOR_TOKEN_COOKIE, visitorToken);
		supabaseResponse.cookies.set(VISITOR_TOKEN_COOKIE, visitorToken, {
			path: "/",
			sameSite: "lax",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 400,
			secure: process.env.NODE_ENV === "production",
		});
	}

	if (!url || !anonKey) {
		console.warn(
			"[proxy][visit] skipped: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
		);
		return supabaseResponse;
	}

	const supabase = createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}

				supabaseResponse = NextResponse.next({
					request,
				});

				for (const { name, value, options } of cookiesToSet) {
					supabaseResponse.cookies.set(name, value, options);
				}

				if (isNewVisitorToken) {
					supabaseResponse.cookies.set(VISITOR_TOKEN_COOKIE, visitorToken!, {
						path: "/",
						sameSite: "lax",
						httpOnly: true,
						maxAge: 60 * 60 * 24 * 400,
						secure: process.env.NODE_ENV === "production",
					});
				}
			},
		},
	});

	try {
		await supabase.auth.getClaims();
	} catch (error) {
		if (isRefreshTokenNotFoundError(error)) {
			const authCookieNames = getSupabaseAuthCookies(request);

			if (authCookieNames.length > 0) {
				console.warn("[proxy] cleared invalid Supabase auth cookies for refresh token fallback");
			}

			for (const name of authCookieNames) {
				supabaseResponse.cookies.set(name, "", {
					maxAge: 0,
					path: "/",
				});
			}
		}
	}

	const pathname = request.nextUrl.pathname;
	const shouldRecordVisit = isDocumentPathForVisitLog(pathname);

	if (shouldRecordVisit) {
		let visitDateStr: string;
		try {
			visitDateStr = getKstDateString();
		} catch {
			visitDateStr = "";
		}

		if (visitDateStr) {
			let authUserId: string | null = null;
			try {
				const { data } = await supabase.auth.getUser();
				authUserId = data.user?.id ?? null;
			} catch {
				authUserId = null;
			}

			const isAuthenticated = Boolean(authUserId);
			const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

			void recordSiteVisitSafe({
				supabaseUrl: url,
				serviceRoleKey: serviceRole,
				visitDate: visitDateStr,
				authUserId: isAuthenticated ? authUserId : null,
				visitorToken: isAuthenticated ? null : visitorToken,
				isAuthenticated,
				path: pathname,
				referrer: request.headers.get("referer") ?? null,
			});
		}
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
