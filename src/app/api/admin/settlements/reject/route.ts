import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

import { findSettlementRequestIdByDisplayKey } from "../resolveRequestKey";

type Body = {
	loginId?: unknown;
	requestedAt?: unknown;
	requestAmount?: unknown;
	rejectionNote?: unknown;
};

async function getWritableAdminContext(): Promise<
	| { ok: true; supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>; adminId: number }
	| { ok: false; status: number; message: string }
> {
	const supabase = await getSupabaseServerClient();
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return { ok: false, status: 401, message: "Unauthorized" };
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
	return { ok: true, supabase, adminId: (adminRows[0] as { id: number }).id };
}

export async function POST(req: NextRequest) {
	const ctx = await getWritableAdminContext();
	if (!ctx.ok) {
		return NextResponse.json({ ok: false, message: ctx.message }, { status: ctx.status });
	}

	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json({ ok: false, message: "invalid_json" }, { status: 400 });
	}

	const loginId = typeof body.loginId === "string" ? body.loginId : "";
	const requestedAt = typeof body.requestedAt === "string" ? body.requestedAt : "";
	const requestAmount = typeof body.requestAmount === "string" ? body.requestAmount : "";
	const rejectionNote = typeof body.rejectionNote === "string" ? body.rejectionNote.trim() : "";

	if (!loginId.trim() || !requestedAt.trim() || !requestAmount.trim()) {
		return NextResponse.json({ ok: false, message: "missing_fields" }, { status: 400 });
	}
	if (!rejectionNote) {
		return NextResponse.json({ ok: false, message: "rejection_note_required" }, { status: 400 });
	}

	const resolved = await findSettlementRequestIdByDisplayKey(ctx.supabase, loginId, requestedAt, requestAmount);
	if (!resolved.ok) {
		return NextResponse.json({ ok: false, message: "not_found" }, { status: 404 });
	}

	const { error } = await ctx.supabase.rpc("reject_partner_settlement_request", {
		p_request_id: resolved.requestId,
		p_processed_by_admin_id: ctx.adminId,
		p_rejection_note: rejectionNote,
	});

	if (error) {
		const msg = typeof error.message === "string" ? error.message : "";
		if (msg.includes("admin_forbidden")) {
			return NextResponse.json({ ok: false, message: "admin_forbidden" }, { status: 403 });
		}
		if (msg.includes("rejection_note_required")) {
			return NextResponse.json({ ok: false, message: "rejection_note_required" }, { status: 400 });
		}
		if (msg.includes("request_not_found")) {
			return NextResponse.json({ ok: false, message: "not_found" }, { status: 404 });
		}
		if (msg.includes("request_not_rejectable")) {
			return NextResponse.json({ ok: false, message: "request_not_rejectable" }, { status: 400 });
		}
		return NextResponse.json({ ok: false, message: "reject_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true, message: null }, { status: 200 });
}
