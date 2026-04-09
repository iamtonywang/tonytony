import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type DeactivateBody = { loginId?: unknown };

function toNonEmptyString(v: unknown): string | null {
	if (typeof v !== "string") return null;
	const t = v.trim();
	return t.length > 0 ? t : null;
}

export async function POST(req: NextRequest) {
	const supabase = await getSupabaseServerClient();

	// 관리자 active 재검증
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
	}
	const { data: meRows } = await supabase.from("users").select("id").eq("auth_user_id", auth.user.id).limit(1);
	const me = Array.isArray(meRows) && meRows.length === 1 ? (meRows[0] as { id: number }) : null;
	if (!me) {
		return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
	}
	const { data: adminRows } = await supabase.from("admins").select("id").eq("user_id", me.id).eq("admin_status", "active").limit(1);
	if (!Array.isArray(adminRows) || adminRows.length !== 1) {
		return NextResponse.json({ ok: false, message: "admin_forbidden" }, { status: 403 });
	}

	let body: DeactivateBody;
	try {
		body = (await req.json()) as DeactivateBody;
	} catch {
		return NextResponse.json({ ok: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
	}
	const loginId = toNonEmptyString(body?.loginId);
	if (!loginId) {
		return NextResponse.json({ ok: false, message: "invalid_login_id" }, { status: 400 });
	}

	const adminClient = getSupabaseAdminClient();

	// 대상 사용자 및 파트너
	const { data: userRows } = await adminClient.from("users").select("id").eq("login_id", loginId).limit(1);
	const user = Array.isArray(userRows) && userRows.length === 1 ? (userRows[0] as { id: number }) : null;
	if (!user) {
		return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
	}
	const { data: partnerRows } = await adminClient.from("partners").select("id").eq("user_id", user.id).limit(1);
	const partner = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;
	if (!partner) {
		return NextResponse.json({ ok: false, message: "partner_not_found" }, { status: 404 });
	}

	// 활성 코드 비활성화
	const now = new Date().toISOString();
	const { error } = await adminClient
		.from("partner_codes")
		.update({ is_active: false, expired_at: now })
		.eq("partner_id", partner.id)
		.eq("is_active", true);
	if (error) {
		return NextResponse.json({ ok: false, message: "code_deactivate_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true, message: null }, { status: 200 });
}

