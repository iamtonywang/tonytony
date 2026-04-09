import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdmin } from "@/app/admin/orders/_server/requireActiveAdmin";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ orderNumber: string }> }) {
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
	const orderNumber = decodeURIComponent(params.orderNumber ?? "").trim();
	if (!orderNumber) {
		return NextResponse.json({ ok: false, item: null, message: "invalid_order_number" }, { status: 400 });
	}

	const { data: orderRows, error: orderErr } = await supabase
		.from("orders")
		.select(
			"id, order_number, order_status, payment_status, currency, subtotal_amount, discount_amount, final_amount, point_used_amount, is_point_payment, buyer_login_id_snapshot, buyer_real_name_snapshot, buyer_phone_snapshot, buyer_email_snapshot, receiver_name, receiver_phone, receiver_email, zipcode, address1, address2, ordered_at, paid_at, completed_at, cancelled_at, refunded_at",
		)
		.eq("order_number", orderNumber)
		.limit(1);

	if (orderErr) {
		return NextResponse.json({ ok: false, item: null, message: "order_fetch_failed" }, { status: 500 });
	}

	const order =
		Array.isArray(orderRows) && orderRows.length === 1
			? (orderRows[0] as {
					id: number;
					order_number: string;
					order_status: string;
					payment_status: string;
					currency: string;
					subtotal_amount: number | string;
					discount_amount: number | string;
					final_amount: number | string;
					point_used_amount: number | string;
					is_point_payment: boolean;
					buyer_login_id_snapshot: string;
					buyer_real_name_snapshot: string | null;
					buyer_phone_snapshot: string;
					buyer_email_snapshot: string;
					receiver_name: string;
					receiver_phone: string;
					receiver_email: string;
					zipcode: string;
					address1: string;
					address2: string | null;
					ordered_at: string;
					paid_at: string | null;
					completed_at: string | null;
					cancelled_at: string | null;
					refunded_at: string | null;
				})
			: null;

	if (!order || typeof order.id !== "number") {
		return NextResponse.json({ ok: false, item: null, message: "order_not_found" }, { status: 404 });
	}

	const internalOrderId = order.id;

	const [itemsRes, payRes, refRes] = await Promise.all([
		supabase
			.from("order_items")
			.select("product_slug, product_name_snapshot, unit_price, quantity, line_total_amount")
			.eq("order_id", internalOrderId)
			.order("created_at", { ascending: true }),
		supabase
			.from("payments")
			.select(
				"payment_method, payment_status, requested_amount, approved_amount, requested_at, approved_at, cancelled_at, refunded_at",
			)
			.eq("order_id", internalOrderId)
			.order("requested_at", { ascending: true }),
		supabase
			.from("refunds")
			.select("refund_status, refund_amount, refund_reason, requested_at, approved_at, rejected_at, completed_at")
			.eq("order_id", internalOrderId)
			.order("requested_at", { ascending: true }),
	]);

	if (itemsRes.error) {
		return NextResponse.json({ ok: false, item: null, message: "order_items_fetch_failed" }, { status: 500 });
	}
	if (payRes.error) {
		return NextResponse.json({ ok: false, item: null, message: "payments_fetch_failed" }, { status: 500 });
	}
	if (refRes.error) {
		return NextResponse.json({ ok: false, item: null, message: "refunds_fetch_failed" }, { status: 500 });
	}

	const lineItems = Array.isArray(itemsRes.data)
		? (itemsRes.data as Array<{
				product_slug: string;
				product_name_snapshot: string;
				unit_price: number | string;
				quantity: number;
				line_total_amount: number | string;
			}>).map((row) => ({
				productSlug: row.product_slug,
				productNameSnapshot: row.product_name_snapshot,
				unitPrice: row.unit_price,
				quantity: row.quantity,
				lineTotalAmount: row.line_total_amount,
			}))
		: [];

	const payments = Array.isArray(payRes.data)
		? (payRes.data as Array<{
				payment_method: string;
				payment_status: string;
				requested_amount: number | string;
				approved_amount: number | string | null;
				requested_at: string;
				approved_at: string | null;
				cancelled_at: string | null;
				refunded_at: string | null;
			}>).map((row) => ({
				paymentMethod: row.payment_method,
				paymentStatus: row.payment_status,
				requestedAmount: row.requested_amount,
				approvedAmount: row.approved_amount,
				requestedAt: row.requested_at,
				approvedAt: row.approved_at,
				cancelledAt: row.cancelled_at,
				refundedAt: row.refunded_at,
			}))
		: [];

	const refunds = Array.isArray(refRes.data)
		? (refRes.data as Array<{
				refund_status: string;
				refund_amount: number | string;
				refund_reason: string;
				requested_at: string;
				approved_at: string | null;
				rejected_at: string | null;
				completed_at: string | null;
			}>).map((row) => ({
				refundStatus: row.refund_status,
				refundAmount: row.refund_amount,
				refundReason: row.refund_reason,
				requestedAt: row.requested_at,
				approvedAt: row.approved_at,
				rejectedAt: row.rejected_at,
				completedAt: row.completed_at,
			}))
		: [];

	return NextResponse.json(
		{
			ok: true,
			item: {
				orderNumber: order.order_number,
				orderStatus: order.order_status,
				paymentStatus: order.payment_status,
				currency: order.currency,
				subtotalAmount: order.subtotal_amount,
				discountAmount: order.discount_amount,
				finalAmount: order.final_amount,
				pointUsedAmount: order.point_used_amount,
				isPointPayment: order.is_point_payment,
				buyerLoginIdSnapshot: order.buyer_login_id_snapshot,
				buyerRealNameSnapshot: order.buyer_real_name_snapshot,
				buyerPhoneSnapshot: order.buyer_phone_snapshot,
				buyerEmailSnapshot: order.buyer_email_snapshot,
				receiverName: order.receiver_name,
				receiverPhone: order.receiver_phone,
				receiverEmail: order.receiver_email,
				zipcode: order.zipcode,
				address1: order.address1,
				address2: order.address2,
				orderedAt: order.ordered_at,
				paidAt: order.paid_at,
				completedAt: order.completed_at,
				cancelledAt: order.cancelled_at,
				refundedAt: order.refunded_at,
				orderItems: lineItems,
				payments,
				refunds,
			},
			message: null,
		},
		{ status: 200 },
	);
}
