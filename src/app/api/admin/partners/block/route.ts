import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type BlockBody = { loginId?: unknown; reason?: unknown };

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
	const admin =
		Array.isArray(adminRows) && adminRows.length === 1
			? (adminRows[0] as { id: number })
			: null;
	if (!admin) {
		return NextResponse.json({ ok: false, message: "admin_forbidden" }, { status: 403 });
	}

	let body: BlockBody;
	try {
		body = (await req.json()) as BlockBody;
	} catch {
		return NextResponse.json({ ok: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
	}
	const loginId = toNonEmptyString(body?.loginId);
	const reason = toNonEmptyString(body?.reason) ?? "blocked";
	if (!loginId) {
		return NextResponse.json({ ok: false, message: "invalid_login_id" }, { status: 400 });
	}

	// 쓰기에는 service-role 사용
	const adminClient = getSupabaseAdminClient();

	// 대상 사용자
	const { data: userRows } = await adminClient.from("users").select("id").eq("login_id", loginId).limit(1);
	const user =
		Array.isArray(userRows) && userRows.length === 1
			? (userRows[0] as { id: number })
			: null;
	if (!user) {
		return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
	}

	// 최신 pending 신청이 있으면 신청 차단
	const { data: appRows } = await adminClient
		.from("partner_applications")
		.select("id, application_status")
		.eq("user_id", user.id)
		.eq("application_status", "pending")
		.order("applied_at", { ascending: false })
		.limit(1);
	const app =
		Array.isArray(appRows) && appRows.length === 1
			? (appRows[0] as { id: number; application_status: string })
			: null;
	if (app) {
		const reviewedAt = new Date().toISOString();
		const { error: appUpdErr } = await adminClient
			.from("partner_applications")
			.update({
				application_status: "blocked",
				reviewed_by_admin_id: admin.id,
				reviewed_at: reviewedAt,
				review_note: reason,
			})
			.eq("id", app.id);
		if (appUpdErr) {
			return NextResponse.json({ ok: false, message: "application_block_failed" }, { status: 500 });
		}
	}

	// partners: 있으면 blocked 전이, 없으면 생성 + blocked
	const { data: partnerRows } = await adminClient.from("partners").select("id").eq("user_id", user.id).limit(1);
	const partner = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;
	const now = new Date().toISOString();
	if (!partner) {
		const { error: insErr } = await adminClient
			.from("partners")
			.insert({
				user_id: user.id,
				partner_status: "blocked",
				approved_by_admin_id: admin.id,
				approved_at: now,
				blocked_at: now,
				block_reason: reason,
			});
		if (insErr) {
		 return NextResponse.json({ ok: false, message: "partner_block_insert_failed" }, { status: 500 });
		}
	} else {
		const { error: updErr } = await adminClient
			.from("partners")
			.update({
				partner_status: "blocked",
				blocked_at: now,
				block_reason: reason,
			})
			.eq("id", partner.id);
		if (updErr) {
			return NextResponse.json({ ok: false, message: "partner_block_failed" }, { status: 500 });
		}
	}

	return NextResponse.json({ ok: true, message: null }, { status: 200 });
}

