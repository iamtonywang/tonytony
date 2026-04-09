import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdminReadonly } from "@/app/admin/refunds/_server/requireActiveAdminReadonly";

const PAGE_SIZE = 20;

type OrderEmbed = {
	order_number: string | null;
	buyer_login_id_snapshot: string | null;
	buyer_real_name_snapshot: string | null;
	buyer_phone_snapshot: string | null;
};

type ListRow = {
	refund_status: string;
	refund_amount: number | string;
	requested_at: string;
	orders: OrderEmbed | OrderEmbed[] | null;
};

export async function GET(req: NextRequest) {
	const r = await requireActiveAdminReadonly();
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

	const { data, error, count } = await supabase
		.from("refunds")
		.select(
			"refund_status, refund_amount, requested_at, orders!inner(order_number, buyer_login_id_snapshot, buyer_real_name_snapshot, buyer_phone_snapshot)",
			{ count: "exact" },
		)
		.order("requested_at", { ascending: false })
		.range(from, to);

	if (error) {
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "refunds_fetch_failed" },
			{ status: 500 },
		);
	}

	const rows = Array.isArray(data) ? (data as ListRow[]) : [];
	const items = rows
		.map((row) => {
			const rawO = row.orders;
			const o = Array.isArray(rawO) ? rawO[0] : rawO;
			const orderNumber = typeof o?.order_number === "string" ? o.order_number : "";
			if (!orderNumber) return null;
			return {
				orderNumber,
				refundStatus: row.refund_status,
				refundAmount: row.refund_amount,
				requestedAt: row.requested_at,
				buyerLoginIdSnapshot: typeof o?.buyer_login_id_snapshot === "string" ? o.buyer_login_id_snapshot : "",
				buyerRealNameSnapshot:
					o?.buyer_real_name_snapshot === null || o?.buyer_real_name_snapshot === undefined
						? null
						: String(o.buyer_real_name_snapshot),
			};
		})
		.filter((v): v is NonNullable<typeof v> => v !== null);

	const total = typeof count === "number" ? count : 0;
	const hasNext = to + 1 < total;

	return NextResponse.json({ ok: true, items, total, hasNext, message: null }, { status: 200 });
}
