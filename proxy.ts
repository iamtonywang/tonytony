import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
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

      // Remove only Supabase auth-token cookies (including chunked variants).
      for (const name of authCookieNames) {
        supabaseResponse.cookies.set(name, "", {
          maxAge: 0,
          path: "/",
        });
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
