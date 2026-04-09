import { NextRequest, NextResponse } from "next/server";

import { findRefundByOrderNumberAndRequestedAt } from "@/app/api/refunds/refundOrderKeyLookup";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundApproveBody = {
	orderNumber?: unknown;
	requestedAt?: unknown;
};

function toNumberOrNull(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
	return null;
}

function parseOrderKey(body: RefundApproveBody): { orderNumber: string; requestedAt: string } | null {
	const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
	const requestedAt = typeof body.requestedAt === "string" ? body.requestedAt.trim() : "";
	if (!orderNumber || !requestedAt) return null;
	return { orderNumber, requestedAt };
}

export async function POST(req: NextRequest) {
	const supabase = await getSupabaseServerClient();

	const { data: authData } = await supabase.auth.getUser();
	if (!authData?.user) {
		return NextResponse.json({ ok: false, message: "Unauthorized", errors: null }, { status: 401 });
	}

	let body: RefundApproveBody;
	try {
		body = (await req.json()) as RefundApproveBody;
	} catch {
		return NextResponse.json({ ok: false, message: "잘못된 요청 형식입니다.", errors: null }, { status: 400 });
	}

	const key = parseOrderKey(body);
	if (!key) {
		return NextResponse.json(
			{ ok: false, message: "입력값 검증에 실패했습니다.", errors: { orderNumber: "required", requestedAt: "required" } },
			{ status: 400 },
		);
	}

	const resolved = await findRefundByOrderNumberAndRequestedAt(supabase, key.orderNumber, key.requestedAt);
	if (!resolved.ok) {
		return NextResponse.json({ ok: false, message: "refund_not_found", errors: null }, { status: 404 });
	}
	const refundId = resolved.refundId;

	const { data: userRows } = await supabase
		.from("users")
		.select("id")
		.eq("auth_user_id", authData.user.id)
		.limit(1);
	const userRow = Array.isArray(userRows) && userRows.length === 1 ? (userRows[0] as { id: number }) : null;

	if (!userRow || typeof userRow.id !== "number") {
		return NextResponse.json({ ok: false, message: "user_not_found", errors: null }, { status: 404 });
	}

	const { data: adminRows } = await supabase
		.from("admins")
		.select("id, user_id, admin_role, admin_status")
		.eq("user_id", userRow.id)
		.eq("admin_status", "active")
		.limit(1);
	const adminRow = Array.isArray(adminRows) && adminRows.length === 1
		? (adminRows[0] as {
				id: number;
				user_id: number;
				admin_role: string;
				admin_status: string;
			})
		: null;

	if (!adminRow || typeof adminRow.id !== "number") {
		return NextResponse.json({ ok: false, message: "admin_forbidden", errors: null }, { status: 403 });
	}

	const { data: refundRows } = await supabase
		.from("refunds")
		.select(
			"id, order_id, payment_id, refund_status, refund_amount, requested_by_user_id, processed_by_admin_id, approved_at, rejected_at, completed_at",
		)
		.eq("id", refundId)
		.limit(1);
	const refundRow = Array.isArray(refundRows) && refundRows.length === 1
		? (refundRows[0] as {
				id: number;
				order_id: number | null;
				payment_id: number | null;
				refund_status: string;
				refund_amount: number | string;
				requested_by_user_id: number;
				processed_by_admin_id: number | null;
				approved_at: string | null;
				rejected_at: string | null;
				completed_at: string | null;
			})
		: null;

	if (!refundRow) {
		return NextResponse.json({ ok: false, message: "refund_not_found", errors: null }, { status: 404 });
	}

	if (
		refundRow.refund_status !== "requested" ||
		refundRow.approved_at !== null ||
		refundRow.rejected_at !== null ||
		refundRow.completed_at !== null ||
		refundRow.order_id === null ||
		refundRow.payment_id === null
	) {
		return NextResponse.json({ ok: false, message: "refund_not_requestable", errors: null }, { status: 400 });
	}

	const { data: orderRows } = await supabase
		.from("orders")
		.select("id, order_status, payment_status, final_amount")
		.eq("id", refundRow.order_id)
		.limit(1);
	const orderRow = Array.isArray(orderRows) && orderRows.length === 1
		? (orderRows[0] as {
				id: number;
				order_status: string;
				payment_status: string;
				final_amount: number | string;
			})
		: null;

	if (!orderRow) {
		return NextResponse.json({ ok: false, message: "order_not_found", errors: null }, { status: 404 });
	}

	const { data: paymentRows } = await supabase
		.from("payments")
		.select("id, order_id, payment_status, requested_amount, approved_amount, refunded_at")
		.eq("id", refundRow.payment_id)
		.eq("order_id", refundRow.order_id)
		.limit(1);
	const paymentRow = Array.isArray(paymentRows) && paymentRows.length === 1
		? (paymentRows[0] as {
				id: number;
				order_id: number;
				payment_status: string;
				requested_amount: number | string;
				approved_amount: number | string | null;
				refunded_at: string | null;
			})
		: null;

	if (!paymentRow) {
		return NextResponse.json({ ok: false, message: "payment_not_found", errors: null }, { status: 404 });
	}

	if (orderRow.order_status !== "paid" || orderRow.payment_status !== "success") {
		return NextResponse.json({ ok: false, message: "order_not_refundable", errors: null }, { status: 400 });
	}

	if (paymentRow.payment_status !== "success") {
		return NextResponse.json({ ok: false, message: "payment_not_refundable", errors: null }, { status: 400 });
	}

	const currentRefundAmount = toNumberOrNull(refundRow.refund_amount);
	const approvedAmount = toNumberOrNull(paymentRow.approved_amount);
	const requestedAmount = toNumberOrNull(paymentRow.requested_amount);
	const paymentAmount = approvedAmount ?? requestedAmount;

	if (
		currentRefundAmount === null ||
		currentRefundAmount <= 0 ||
		paymentAmount === null ||
		paymentAmount <= 0
	) {
		return NextResponse.json({ ok: false, message: "refund_amount_invalid", errors: null }, { status: 400 });
	}

	if (currentRefundAmount !== paymentAmount) {
		return NextResponse.json({ ok: false, message: "full_refund_only", errors: null }, { status: 400 });
	}

	const approvedAt = new Date().toISOString();
	const { data: updatedRefund, error: refundApproveError } = await supabase
		.from("refunds")
		.update({
			refund_status: "approved",
			processed_by_admin_id: adminRow.id,
			approved_at: approvedAt,
		})
		.eq("id", refundRow.id)
		.eq("refund_status", "requested")
		.select("id")
		.single();

	if (refundApproveError || !updatedRefund) {
		return NextResponse.json({ ok: false, message: "refund_approve_failed", errors: null }, { status: 500 });
	}

	return NextResponse.json({ ok: true, message: "Refund approved", errors: null }, { status: 200 });
}
