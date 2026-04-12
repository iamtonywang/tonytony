import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_CURRENCY = "KRW";

type Body = {
	slug?: unknown;
	priceAmount?: unknown;
	discountAmount?: unknown;
};

function toNonNegativeNumber(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v) && v >= 0) return v;
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		if (Number.isFinite(n) && n >= 0) return n;
	}
	return null;
}

async function getWritableAdminContext(): Promise<
	| { ok: true; supabase: Awaited<ReturnType<typeof getSupabaseServerClient>> }
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
	return { ok: true, supabase };
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

	const slug = typeof body.slug === "string" ? body.slug.trim() : "";
	const priceAmount = toNonNegativeNumber(body.priceAmount);
	const discountAmount = toNonNegativeNumber(body.discountAmount);

	if (!slug) {
		return NextResponse.json({ ok: false, message: "slug_required" }, { status: 400 });
	}
	if (priceAmount === null) {
		return NextResponse.json({ ok: false, message: "invalid_price_amount" }, { status: 400 });
	}
	if (discountAmount === null) {
		return NextResponse.json({ ok: false, message: "invalid_discount_amount" }, { status: 400 });
	}

	const finalPriceAmount = Math.round((priceAmount - discountAmount) * 100) / 100;
	if (finalPriceAmount < 0) {
		return NextResponse.json({ ok: false, message: "final_price_negative" }, { status: 400 });
	}

	const nowIso = new Date().toISOString();
	const { supabase } = ctx;

	const { data: productRows, error: productErr } = await supabase
		.from("products")
		.select("id")
		.eq("slug", slug)
		.limit(1);

	if (productErr) {
		return NextResponse.json({ ok: false, message: "product_lookup_failed" }, { status: 500 });
	}
	const productRow = Array.isArray(productRows) && productRows.length === 1 ? (productRows[0] as { id: number }) : null;
	if (!productRow || typeof productRow.id !== "number") {
		return NextResponse.json({ ok: false, message: "product_not_found" }, { status: 404 });
	}

	const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceUrl || !serviceRoleKey) {
		return NextResponse.json({ ok: false, message: "server_misconfigured" }, { status: 500 });
	}

	const serviceSupabase = createClient(serviceUrl, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});

	const { error: deactivateErr } = await serviceSupabase
		.from("product_prices")
		.update({
			is_active: false,
			effective_to: nowIso,
			updated_at: nowIso,
		})
		.eq("product_id", productRow.id)
		.eq("is_active", true);

	if (deactivateErr) {
		console.error(
			"admin_products_price_deactivate_failed",
			JSON.stringify({
				label: "admin_products_price_deactivate_failed",
				slug,
				productId: productRow.id,
				message: deactivateErr.message,
				code: deactivateErr.code,
				details: deactivateErr.details,
				hint: deactivateErr.hint,
			}),
		);
		return NextResponse.json({ ok: false, message: "deactivate_failed" }, { status: 500 });
	}

	const { error: insertErr } = await serviceSupabase.from("product_prices").insert({
		product_id: productRow.id,
		currency: DEFAULT_CURRENCY,
		price_amount: priceAmount,
		discount_amount: discountAmount,
		final_price_amount: finalPriceAmount,
		is_active: true,
		effective_from: nowIso,
		effective_to: null,
	});

	if (insertErr) {
		console.error(
			"admin_products_price_insert_failed",
			JSON.stringify({
				label: "admin_products_price_insert_failed",
				slug,
				productId: productRow.id,
				message: insertErr.message,
				code: insertErr.code,
				details: insertErr.details,
				hint: insertErr.hint,
			}),
		);
		return NextResponse.json({ ok: false, message: "insert_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true }, { status: 200 });
}
