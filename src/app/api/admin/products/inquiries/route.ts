import { NextRequest, NextResponse } from "next/server";

import { getAdminProductInquiriesBySlug } from "@/app/admin/products/_server/getAdminProductInquiriesBySlug";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "private, no-store" } as const;

async function requireActiveAdmin(): Promise<
	{ ok: true } | { ok: false; status: number; message: string }
> {
	const supabase = await getSupabaseServerClient();
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return { ok: false, status: 401, message: "unauthorized" };
	}
	const { data: meRows } = await supabase.from("users").select("id").eq("auth_user_id", auth.user.id).limit(1);
	const me = Array.isArray(meRows) && meRows.length === 1 ? (meRows[0] as { id: number }) : null;
	if (!me) {
		return { ok: false, status: 404, message: "user_not_found" };
	}
	const { data: adminRows } = await supabase
		.from("admins")
		.select("id")
		.eq("user_id", me.id)
		.eq("admin_status", "active")
		.limit(1);
	if (!Array.isArray(adminRows) || adminRows.length !== 1) {
		return { ok: false, status: 403, message: "admin_forbidden" };
	}
	return { ok: true };
}

export async function GET(req: NextRequest) {
	const slugRaw = req.nextUrl.searchParams.get("slug");
	const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
	if (!slug) {
		return NextResponse.json({ ok: false, message: "slug_required" }, { status: 400, headers: NO_STORE });
	}

	const auth = await requireActiveAdmin();
	if (!auth.ok) {
		return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status, headers: NO_STORE });
	}

	try {
		const items = await getAdminProductInquiriesBySlug(slug);
		return NextResponse.json({ ok: true, items }, { status: 200, headers: NO_STORE });
	} catch {
		return NextResponse.json({ ok: false, message: "load_failed" }, { status: 500, headers: NO_STORE });
	}
}
