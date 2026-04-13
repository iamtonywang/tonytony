import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type Body = {
	action?: unknown;
	inquiryId?: unknown;
	answerContent?: unknown;
};

async function getWritableAdminContextWithAdminId(): Promise<
	| { ok: true; supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>; adminId: number }
	| { ok: false; status: number; message: string }
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
	const adminRow =
		Array.isArray(adminRows) && adminRows.length === 1 ? (adminRows[0] as { id: number | string }) : null;
	const adminId =
		adminRow && typeof adminRow.id === "number"
			? adminRow.id
			: adminRow && typeof adminRow.id === "string"
				? Number(adminRow.id)
				: NaN;
	if (!Number.isFinite(adminId) || adminId <= 0) {
		return { ok: false, status: 403, message: "admin_forbidden" };
	}
	return { ok: true, supabase, adminId };
}

function parseInquiryId(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.floor(v);
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v.trim());
		if (Number.isFinite(n) && n > 0) return Math.floor(n);
	}
	return null;
}

export async function POST(req: NextRequest) {
	const ctx = await getWritableAdminContextWithAdminId();
	if (!ctx.ok) {
		return NextResponse.json({ ok: false, message: ctx.message }, { status: ctx.status });
	}

	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json({ ok: false, message: "invalid_json" }, { status: 400 });
	}

	const rawAction = typeof body.action === "string" ? body.action.trim() : "";
	if (rawAction === "hide") {
		const hideInquiryId = parseInquiryId(body.inquiryId);
		if (hideInquiryId === null) {
			return NextResponse.json({ ok: false, message: "inquiry_id_required" }, { status: 400 });
		}

		const { supabase } = ctx;
		const nowIso = new Date().toISOString();

		const { data: hiddenRows, error: hideErr } = await supabase
			.from("inquiries")
			.update({
				inquiry_status: "hidden",
				updated_at: nowIso,
			})
			.eq("id", hideInquiryId)
			.select("id");

		if (hideErr) {
			return NextResponse.json(
				{
					ok: false,
					message: "update_failed",
					error: hideErr.message,
					code: hideErr.code,
					detail: hideErr.details,
					hint: hideErr.hint,
				},
				{ status: 500 },
			);
		}
		if (!Array.isArray(hiddenRows) || hiddenRows.length !== 1) {
			return NextResponse.json({ ok: false, message: "inquiry_not_found" }, { status: 404 });
		}

		return NextResponse.json({ ok: true }, { status: 200 });
	}

	const inquiryId = parseInquiryId(body.inquiryId);
	if (inquiryId === null) {
		return NextResponse.json({ ok: false, message: "inquiry_id_required" }, { status: 400 });
	}

	const rawAnswer = typeof body.answerContent === "string" ? body.answerContent : "";
	const answerContent = rawAnswer.trim();
	if (answerContent.length === 0) {
		return NextResponse.json({ ok: false, message: "answer_content_required" }, { status: 400 });
	}

	const { supabase, adminId } = ctx;

	const { data: existing, error: selErr } = await supabase
		.from("inquiries")
		.select("id")
		.eq("id", inquiryId)
		.in("inquiry_status", ["active", "answered"])
		.limit(1);

	if (selErr) {
		return NextResponse.json({ ok: false, message: "inquiry_lookup_failed" }, { status: 500 });
	}
	if (!Array.isArray(existing) || existing.length !== 1) {
		return NextResponse.json({ ok: false, message: "inquiry_not_answerable" }, { status: 404 });
	}

	const nowIso = new Date().toISOString();

	const { data: updated, error: upErr } = await supabase
		.from("inquiries")
		.update({
			answer_content: answerContent,
			inquiry_status: "answered",
			answered_at: nowIso,
			answered_by_admin_id: adminId,
			updated_at: nowIso,
		})
		.eq("id", inquiryId)
		.in("inquiry_status", ["active", "answered"])
		.select("id");

	if (upErr) {
		return NextResponse.json({ ok: false, message: "update_failed" }, { status: 500 });
	}
	if (!Array.isArray(updated) || updated.length !== 1) {
		return NextResponse.json({ ok: false, message: "inquiry_not_answerable" }, { status: 404 });
	}

	return NextResponse.json({ ok: true }, { status: 200 });
}
