import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdmin } from "@/app/admin/orders/_server/requireActiveAdmin";

const PAGE_SIZE = 20;

type OrderRow = {
	order_number: string;
	buyer_login_id_snapshot: string;
	buyer_real_name_snapshot: string | null;
	buyer_phone_snapshot: string;
	order_status: string;
	payment_status: string;
	final_amount: number | string;
	ordered_at: string;
};

export async function GET(req: NextRequest) {
	const r = await requireActiveAdmin();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json(
				{ ok: false, items: [], total: 0, hasNext: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json(
				{ ok: false, items: [], total: 0, hasNext: false, message: "user_not_found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "admin_forbidden" },
			{ status: 403 },
		);
	}
	const { supabase } = r;

	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = Math.max(1, Number.isFinite(Number(pageParam)) ? Number(pageParam) : 1);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const [listRes, nextCheckRes] = await Promise.all([
		supabase
			.from("orders")
			.select(
				"order_number, buyer_login_id_snapshot, buyer_real_name_snapshot, buyer_phone_snapshot, order_status, payment_status, final_amount, ordered_at",
			)
			.order("ordered_at", { ascending: false })
			.range(from, to),
		supabase.from("orders").select("id").order("ordered_at", { ascending: false }).range(to + 1, to + 1),
	]);

	if (listRes.error) {
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "orders_fetch_failed" },
			{ status: 500 },
		);
	}

	const rows = Array.isArray(listRes.data) ? (listRes.data as OrderRow[]) : [];
	const items = rows.map((row) => ({
		orderNumber: row.order_number,
		buyerLoginIdSnapshot: row.buyer_login_id_snapshot,
		buyerRealNameSnapshot: row.buyer_real_name_snapshot,
		buyerPhoneSnapshot: row.buyer_phone_snapshot,
		orderStatus: row.order_status,
		paymentStatus: row.payment_status,
		finalAmount: row.final_amount,
		orderedAt: row.ordered_at,
	}));

	const hasNext = Array.isArray(nextCheckRes.data) && nextCheckRes.data.length > 0;
	const total = hasNext ? from + PAGE_SIZE + 1 : from + rows.length;

	return NextResponse.json({ ok: true, items, total, hasNext, message: null }, { status: 200 });
}
