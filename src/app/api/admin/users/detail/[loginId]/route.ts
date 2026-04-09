import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdmin } from "@/app/admin/users/_server/requireActiveAdmin";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ loginId: string }> }) {
	const r = await requireActiveAdmin();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
		}
		return NextResponse.json({ ok: false, item: null, message: "admin_forbidden" }, { status: 403 });
	}
	const { supabase } = r;

	const params = await ctx.params;
	const loginId = decodeURIComponent(params.loginId ?? "").trim();
	if (!loginId) {
		return NextResponse.json({ ok: false, item: null, message: "invalid_login_id" }, { status: 400 });
	}

	const { data: userRows, error: userErr } = await supabase
		.from("users")
		.select("id, login_id, phone, email, user_status, created_at, last_login_at")
		.eq("login_id", loginId)
		.limit(1);

	if (userErr) {
		return NextResponse.json({ ok: false, item: null, message: "user_fetch_failed" }, { status: 500 });
	}

	const user =
		Array.isArray(userRows) && userRows.length === 1
			? (userRows[0] as {
					id: number;
					login_id: string;
					phone: string;
					email: string | null;
					user_status: string;
					created_at: string;
					last_login_at: string | null;
				})
			: null;

	if (!user || typeof user.id !== "number") {
		return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
	}

	const [{ data: profileRows }, orderCountRes, refundCountRes] = await Promise.all([
		supabase.from("user_profiles").select("real_name, zipcode, address1, address2").eq("user_id", user.id).limit(1),
		supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
		supabase.from("refunds").select("*", { count: "exact", head: true }).eq("requested_by_user_id", user.id),
	]);

	const profile =
		Array.isArray(profileRows) && profileRows.length === 1
			? (profileRows[0] as {
					real_name: string | null;
					zipcode: string | null;
					address1: string | null;
					address2: string | null;
				})
			: null;

	return NextResponse.json(
		{
			ok: true,
			item: {
				loginId: user.login_id,
				realName: profile?.real_name ?? null,
				phone: user.phone,
				email: user.email,
				userStatus: user.user_status,
				createdAt: user.created_at,
				lastLoginAt: user.last_login_at,
				zipcode: profile?.zipcode ?? null,
				address1: profile?.address1 ?? null,
				address2: profile?.address2 ?? null,
				orderCount: orderCountRes.count ?? 0,
				refundCount: refundCountRes.count ?? 0,
			},
			message: null,
		},
		{ status: 200 },
	);
}
