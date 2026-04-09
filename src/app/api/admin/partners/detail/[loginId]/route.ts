import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

function maskAccountNumber(raw: string | null): string | null {
	if (!raw) return null;
	const value = raw.trim();
	if (!value) return null;
	const visible = value.slice(-4);
	const maskedLen = Math.max(0, value.length - 4);
	return `${"*".repeat(maskedLen)}${visible}`;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ loginId: string }> }) {
	const supabase = await getSupabaseServerClient();
	// 관리자 active 검증
	const { data: auth } = await supabase.auth.getUser();
	if (!auth?.user) {
		return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
	}
	const { data: meRows } = await supabase.from("users").select("id").eq("auth_user_id", auth.user.id).limit(1);
	const me = Array.isArray(meRows) && meRows.length === 1 ? (meRows[0] as { id: number }) : null;
	if (!me) {
		return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
	}
	const { data: adminRows } = await supabase.from("admins").select("id").eq("user_id", me.id).eq("admin_status", "active").limit(1);
	if (!Array.isArray(adminRows) || adminRows.length !== 1) {
		return NextResponse.json({ ok: false, item: null, message: "admin_forbidden" }, { status: 403 });
	}

	const params = await ctx.params;
	const loginId = decodeURIComponent(params.loginId ?? "").trim();
	if (!loginId) {
		return NextResponse.json({ ok: false, item: null, message: "invalid_login_id" }, { status: 400 });
	}

	// users
	const { data: userRows } = await supabase.from("users").select("id, login_id, phone, email").eq("login_id", loginId).limit(1);
	const user =
		Array.isArray(userRows) && userRows.length === 1
			? (userRows[0] as { id: number; login_id: string | null; phone: string | null; email: string | null })
			: null;
	if (!user || typeof user.id !== "number") {
		return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
	}

	// user_profiles
	const { data: profileRows } = await supabase.from("user_profiles").select("real_name").eq("user_id", user.id).limit(1);
	const profile = Array.isArray(profileRows) && profileRows.length === 1 ? (profileRows[0] as { real_name: string | null }) : null;

	// partner_applications: 최신 1건 기준 상태
	const { data: appRows } = await supabase
		.from("partner_applications")
		.select("application_status, reviewed_at, reviewed_by_admin_id")
		.eq("user_id", user.id)
		.order("applied_at", { ascending: false })
		.limit(1);
	const applicationStatus =
		Array.isArray(appRows) && appRows.length === 1 ? ((appRows[0] as { application_status: string | null })?.application_status ?? null) : null;

	// partners
	const { data: partnerRows } = await supabase.from("partners").select("id, partner_status").eq("user_id", user.id).limit(1);
	const partner =
		Array.isArray(partnerRows) && partnerRows.length === 1
			? (partnerRows[0] as { id: number; partner_status: string | null })
			: null;

	// codes (active 1건)
	let activeReferralCode: string | null = null;
	if (partner?.id) {
		const { data: codeRows } = await supabase
			.from("partner_codes")
			.select("referral_code, is_active, created_at")
			.eq("partner_id", partner.id)
			.eq("is_active", true)
			.order("created_at", { ascending: false })
			.limit(1);
		if (Array.isArray(codeRows) && codeRows.length === 1) {
			activeReferralCode = (codeRows[0] as { referral_code: string | null }).referral_code ?? null;
		}
	}

	// bank account (마스킹)
	let bankAccountMasked: string | null = null;
	if (partner?.id) {
		const { data: baRows } = await supabase
			.from("partner_bank_accounts")
			.select("account_number, created_at")
			.eq("partner_id", partner.id)
			.order("created_at", { ascending: false })
			.limit(1);
		if (Array.isArray(baRows) && baRows.length === 1) {
			bankAccountMasked = maskAccountNumber((baRows[0] as { account_number: string | null }).account_number ?? null);
		}
	}

	// 판매현황: 최소 placeholder
	const salesSummary = { todayGross: null, monthGross: null };

	return NextResponse.json(
		{
			ok: true,
			item: {
				loginId: user.login_id ?? loginId,
				realName: profile?.real_name ?? null,
				phone: user.phone ?? null,
				email: user.email ?? null,
				applicationStatus,
				partnerStatus: partner?.partner_status ?? null,
				activeReferralCode,
				bankAccountMasked,
				salesSummary,
			},
			message: null,
		},
		{ status: 200 },
	);
}

