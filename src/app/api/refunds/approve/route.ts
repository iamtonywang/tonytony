import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundApproveBody = {
  refundId?: unknown;
};

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "Unauthorized", errors: null },
      { status: 401 },
    );
  }

  let body: RefundApproveBody;
  try {
    body = (await req.json()) as RefundApproveBody;
  } catch {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "잘못된 요청 형식입니다.", errors: null },
      { status: 400 },
    );
  }

  const refundId = toNumberOrNull(body?.refundId);
  const errors: Record<string, string> = {};
  if (refundId === null) errors.refundId = "required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "입력값 검증에 실패했습니다.", errors },
      { status: 400 },
    );
  }

  const { data: userRows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .limit(1);
  const userRow = Array.isArray(userRows) && userRows.length === 1 ? (userRows[0] as { id: number }) : null;

  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "user_not_found", errors: null },
      { status: 404 },
    );
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
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "admin_forbidden", errors: null },
      { status: 403 },
    );
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
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_not_found", errors: null },
      { status: 404 },
    );
  }

  if (
    refundRow.refund_status !== "requested" ||
    refundRow.approved_at !== null ||
    refundRow.rejected_at !== null ||
    refundRow.completed_at !== null ||
    refundRow.order_id === null ||
    refundRow.payment_id === null
  ) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_not_requestable", errors: null },
      { status: 400 },
    );
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
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "order_not_found", errors: null },
      { status: 404 },
    );
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
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "payment_not_found", errors: null },
      { status: 404 },
    );
  }

  if (orderRow.order_status !== "paid" || orderRow.payment_status !== "success") {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "order_not_refundable", errors: null },
      { status: 400 },
    );
  }

  if (paymentRow.payment_status !== "success") {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "payment_not_refundable", errors: null },
      { status: 400 },
    );
  }

  const currentRefundAmount = toNumberOrNull(refundRow.refund_amount);
  const approvedAmount = toNumberOrNull(paymentRow.approved_amount);
  const requestedAmount = toNumberOrNull(paymentRow.requested_amount);
  const refundableCap = approvedAmount ?? requestedAmount;

  if (
    currentRefundAmount === null ||
    currentRefundAmount <= 0 ||
    refundableCap === null ||
    refundableCap <= 0
  ) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_amount_invalid", errors: null },
      { status: 400 },
    );
  }

  // DDL에 누적 환불합 상한 제약이 없으므로 approve 단계에서 코드로 직접 검증한다.
  const { data: existingRefundRows } = await supabase
    .from("refunds")
    .select("id, refund_amount")
    .eq("payment_id", paymentRow.id)
    .in("refund_status", ["approved", "completed"]);

  const existingApprovedOrCompletedSum = Array.isArray(existingRefundRows)
    ? existingRefundRows
      .filter((r) => {
        const id = toNumberOrNull((r as { id?: unknown }).id);
        return id !== refundRow.id;
      })
      .reduce((acc, r) => {
        const amount = toNumberOrNull((r as { refund_amount?: unknown }).refund_amount);
        return acc + (amount ?? 0);
      }, 0)
    : 0;

  if (existingApprovedOrCompletedSum + currentRefundAmount > refundableCap) {
    return NextResponse.json(
      {
        ok: false,
        refundId: null,
        orderId: null,
        paymentId: null,
        message: "refund_amount_exceeds_payment",
        errors: null,
      },
      { status: 400 },
    );
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
    .select("id, order_id, payment_id, refund_status, refund_amount, processed_by_admin_id, approved_at")
    .single();

  if (refundApproveError || !updatedRefund) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_approve_failed", errors: null },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      refundId: updatedRefund.id,
      orderId: updatedRefund.order_id,
      paymentId: updatedRefund.payment_id,
      message: "Refund approved",
      errors: null,
    },
    { status: 200 },
  );
}

