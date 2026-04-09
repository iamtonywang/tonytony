import { NextRequest, NextResponse } from "next/server";

import { findRefundByOrderNumberAndRequestedAt } from "@/app/api/refunds/refundOrderKeyLookup";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundRejectBody = {
	orderNumber?: unknown;
	requestedAt?: unknown;
	rejectionReason?: unknown;
};

function parseOrderKey(body: RefundRejectBody): { orderNumber: string; requestedAt: string } | null {
	const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
	const requestedAt = typeof body.requestedAt === "string" ? body.requestedAt.trim() : "";
	if (!orderNumber || !requestedAt) return null;
	return { orderNumber, requestedAt };
}

function trimRejectionReason(v: unknown): string | null {
	if (typeof v !== "string") return null;
	const t = v.trim();
	return t.length > 0 ? t : null;
}

export async function POST(req: NextRequest) {
	const supabase = await getSupabaseServerClient();

	const { data: authData } = await supabase.auth.getUser();
	if (!authData?.user) {
		return NextResponse.json({ ok: false, message: "Unauthorized", errors: null }, { status: 401 });
	}

	let body: RefundRejectBody;
	try {
		body = (await req.json()) as RefundRejectBody;
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

	const rejectionReason = trimRejectionReason(body.rejectionReason);
	if (!rejectionReason) {
		return NextResponse.json(
			{ ok: false, message: "입력값 검증에 실패했습니다.", errors: { rejectionReason: "required" } },
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
		refundRow.completed_at !== null
	) {
		return NextResponse.json({ ok: false, message: "refund_not_rejectable", errors: null }, { status: 400 });
	}

	if (refundRow.order_id === null) {
		return NextResponse.json({ ok: false, message: "order_not_found", errors: null }, { status: 404 });
	}

	const { data: orderRows } = await supabase
		.from("orders")
		.select("id, order_status, payment_status")
		.eq("id", refundRow.order_id)
		.limit(1);
	const orderRow = Array.isArray(orderRows) && orderRows.length === 1
		? (orderRows[0] as {
				id: number;
				order_status: string;
				payment_status: string;
			})
		: null;

	if (!orderRow) {
		return NextResponse.json({ ok: false, message: "order_not_found", errors: null }, { status: 404 });
	}

	if (refundRow.payment_id !== null) {
		const { data: paymentRows } = await supabase
			.from("payments")
			.select("id, order_id, payment_status")
			.eq("id", refundRow.payment_id)
			.eq("order_id", refundRow.order_id)
			.limit(1);
		const paymentRow = Array.isArray(paymentRows) && paymentRows.length === 1
			? (paymentRows[0] as {
					id: number;
					order_id: number;
					payment_status: string;
				})
			: null;

		if (!paymentRow) {
			return NextResponse.json({ ok: false, message: "payment_not_found", errors: null }, { status: 404 });
		}
	}

	const rejectedAt = new Date().toISOString();
	const { data: updatedRefund, error: refundRejectError } = await supabase
		.from("refunds")
		.update({
			refund_status: "rejected",
			processed_by_admin_id: adminRow.id,
			rejected_at: rejectedAt,
			rejection_reason: rejectionReason,
		})
		.eq("id", refundRow.id)
		.eq("refund_status", "requested")
		.select("id")
		.single();

	if (refundRejectError || !updatedRefund) {
		return NextResponse.json({ ok: false, message: "refund_reject_failed", errors: null }, { status: 500 });
	}

	return NextResponse.json({ ok: true, message: "Refund rejected", errors: null }, { status: 200 });
}
