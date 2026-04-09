import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdminReadonly } from "@/app/admin/refunds/_server/requireActiveAdminReadonly";

export async function GET(req: NextRequest) {
	const r = await requireActiveAdminReadonly();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
		}
		return NextResponse.json({ ok: false, item: null, message: "admin_forbidden" }, { status: 403 });
	}

	const url = new URL(req.url);
	const orderNumber = (url.searchParams.get("orderNumber") ?? "").trim();
	const requestedAt = (url.searchParams.get("requestedAt") ?? "").trim();

	if (!orderNumber || !requestedAt) {
		return NextResponse.json({ ok: false, item: null, message: "missing_params" }, { status: 400 });
	}

	const { supabase } = r;

	const { data: orderRows, error: orderErr } = await supabase
		.from("orders")
		.select(
			"id, order_number, order_status, payment_status, buyer_login_id_snapshot, buyer_real_name_snapshot, buyer_phone_snapshot, buyer_email_snapshot",
		)
		.eq("order_number", orderNumber)
		.limit(1);

	if (orderErr || !Array.isArray(orderRows) || orderRows.length !== 1) {
		return NextResponse.json({ ok: false, item: null, message: "not_found" }, { status: 404 });
	}

	const orderRow = orderRows[0] as {
		id: number;
		order_number: string;
		order_status: string;
		payment_status: string;
		buyer_login_id_snapshot: string;
		buyer_real_name_snapshot: string | null;
		buyer_phone_snapshot: string;
		buyer_email_snapshot: string | null;
	};

	const { data: refundRows, error: refundErr } = await supabase
		.from("refunds")
		.select(
			"refund_status, refund_amount, refund_reason, rejection_reason, requested_at, approved_at, rejected_at, completed_at, payment_id, order_id",
		)
		.eq("order_id", orderRow.id)
		.eq("requested_at", requestedAt)
		.limit(1);

	if (refundErr || !Array.isArray(refundRows) || refundRows.length !== 1) {
		return NextResponse.json({ ok: false, item: null, message: "not_found" }, { status: 404 });
	}

	const fr = refundRows[0] as {
		refund_status: string;
		refund_amount: number | string;
		refund_reason: string;
		rejection_reason: string | null;
		requested_at: string;
		approved_at: string | null;
		rejected_at: string | null;
		completed_at: string | null;
		payment_id: number | null;
		order_id: number;
	};

	let paymentSummary: {
		paymentStatus: string;
		paymentMethod: string;
		requestedAmount: number | string;
		approvedAmount: number | string | null;
		refundedAt: string | null;
	} | null = null;

	if (typeof fr.payment_id === "number") {
		const { data: payRows, error: payErr } = await supabase
			.from("payments")
			.select("payment_status, payment_method, requested_amount, approved_amount, refunded_at")
			.eq("id", fr.payment_id)
			.eq("order_id", fr.order_id)
			.limit(1);

		if (!payErr && Array.isArray(payRows) && payRows.length === 1) {
			const p = payRows[0] as {
				payment_status: string;
				payment_method: string;
				requested_amount: number | string;
				approved_amount: number | string | null;
				refunded_at: string | null;
			};
			paymentSummary = {
				paymentStatus: p.payment_status,
				paymentMethod: p.payment_method,
				requestedAmount: p.requested_amount,
				approvedAmount: p.approved_amount,
				refundedAt: p.refunded_at,
			};
		}
	}

	const item = {
		orderNumber: orderRow.order_number,
		orderStatus: orderRow.order_status,
		orderPaymentStatus: orderRow.payment_status,
		refundStatus: fr.refund_status,
		refundAmount: fr.refund_amount,
		refundReason: fr.refund_reason,
		rejectionReason: fr.rejection_reason,
		requestedAt: fr.requested_at,
		approvedAt: fr.approved_at,
		rejectedAt: fr.rejected_at,
		completedAt: fr.completed_at,
		buyerLoginIdSnapshot: orderRow.buyer_login_id_snapshot,
		buyerRealNameSnapshot: orderRow.buyer_real_name_snapshot,
		buyerPhoneSnapshot: orderRow.buyer_phone_snapshot,
		buyerEmailSnapshot: orderRow.buyer_email_snapshot,
		paymentSummary,
	};

	return NextResponse.json({ ok: true, item, message: null }, { status: 200 });
}
