import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
	const supabase = await getSupabaseServerReadonlyClient();
	// 관리자 active 검증
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "Unauthorized" }, { status: 401 });
	}
	const { data: meRows } = await supabase.from("users").select("id").eq("auth_user_id", auth.user.id).limit(1);
	const me = Array.isArray(meRows) && meRows.length === 1 ? (meRows[0] as { id: number }) : null;
	if (!me) {
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "user_not_found" }, { status: 404 });
	}
	const { data: adminRows } = await supabase.from("admins").select("id").eq("user_id", me.id).eq("admin_status", "active").limit(1);
	if (!Array.isArray(adminRows) || adminRows.length !== 1) {
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "admin_forbidden" }, { status: 403 });
	}

	// 페이지네이션
	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = Math.max(1, Number.isFinite(Number(pageParam)) ? Number(pageParam) : 1);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	// 최소 표시값: login_id / phone / application_status
	const { data, error, count } = await supabase
		.from("partner_applications")
		.select("user_id, application_status, users!inner(login_id, phone)", { count: "exact" })
		.eq("application_status", "pending")
		.order("applied_at", { ascending: false })
		.range(from, to);

	if (error) {
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "applications_fetch_failed" }, { status: 500 });
	}

	const items =
		Array.isArray(data)
			? data
					.map((r: any) => ({
						loginId: r.users?.login_id ?? null,
						phone: r.users?.phone ?? null,
						applicationStatus: r.application_status ?? null,
					}))
					.filter((v) => typeof v.loginId === "string" && v.loginId.trim().length > 0)
			: [];

	const total = typeof count === "number" ? count : 0;
	const hasNext = to + 1 < total;

	return NextResponse.json({ ok: true, items, hasNext, message: null }, { status: 200 });
}

