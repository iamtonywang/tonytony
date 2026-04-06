import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundRequestBody = {
  orderId?: unknown;
  paymentId?: unknown;
  refundAmount?: unknown;
  refundReason?: unknown;
};

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
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

  let body: RefundRequestBody;
  try {
    body = (await req.json()) as RefundRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "잘못된 요청 형식입니다.", errors: null },
      { status: 400 },
    );
  }

  const orderId = toNumberOrNull(body?.orderId);
  const paymentId = toNumberOrNull(body?.paymentId);
  const refundAmount = toNumberOrNull(body?.refundAmount);
  const refundReason = trimOrNull(body?.refundReason);

  const errors: Record<string, string> = {};
  if (orderId === null) errors.orderId = "required";
  if (refundAmount === null || refundAmount <= 0) errors.refundAmount = "must_be_positive_number";
  if (!refundReason) errors.refundReason = "required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        refundId: null,
        orderId: null,
        paymentId: null,
        message: "입력값 검증에 실패했습니다.",
        errors,
      },
      { status: 400 },
    );
  }

  if (paymentId === null) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "payment_id_required", errors: null },
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

  const { data: orderRows } = await supabase
    .from("orders")
    .select("id, user_id, order_status, payment_status, final_amount")
    .eq("id", orderId)
    .eq("user_id", userRow.id)
    .limit(1);
  const orderRow = Array.isArray(orderRows) && orderRows.length === 1
    ? (orderRows[0] as {
      id: number;
      user_id: number;
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
    .select("id, order_id, payment_status, requested_amount, approved_amount, refunded_at, approved_at")
    .eq("id", paymentId)
    .eq("order_id", orderId)
    .limit(1);
  const paymentRow = Array.isArray(paymentRows) && paymentRows.length === 1
    ? (paymentRows[0] as {
      id: number;
      order_id: number;
      payment_status: string;
      requested_amount: number | string;
      approved_amount: number | string | null;
      refunded_at: string | null;
      approved_at: string | null;
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

  const approvedAmount = toNumberOrNull(paymentRow.approved_amount);
  const requestedAmount = toNumberOrNull(paymentRow.requested_amount);
  const paymentAmount = approvedAmount ?? requestedAmount;

  // 전액 환불 여부 비교 전에 결제 기준 금액 자체가 유효해야 한다.
  if (refundAmount === null || paymentAmount === null || paymentAmount <= 0) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_amount_invalid", errors: null },
      { status: 400 },
    );
  }

  // partial refund 금지 정책: 환불은 반드시 결제 전체 금액과 동일해야 한다.
  if (refundAmount !== paymentAmount) {
    return NextResponse.json(
      {
        ok: false,
        refundId: null,
        orderId: null,
        paymentId: null,
        message: "full_refund_only",
        errors: { refundAmount: "must_equal_full_payment_amount" },
      },
      { status: 400 },
    );
  }

  const { data: existingRefundRows } = await supabase
    .from("refunds")
    .select("refund_status")
    .eq("order_id", orderId);

  const existingStatuses = Array.isArray(existingRefundRows)
    ? existingRefundRows
      .map((r) => (r as { refund_status?: string | null }).refund_status)
      .filter((v): v is string => typeof v === "string")
    : [];

  if (existingStatuses.includes("completed")) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "completed_refund_exists", errors: null },
      { status: 400 },
    );
  }

  // DDL 트리거는 completed 와 requested/approved 공존 금지를 강제하므로, 요청 단계에서도 중복 active 환불을 선차단
  if (existingStatuses.includes("requested") || existingStatuses.includes("approved")) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_already_exists", errors: null },
      { status: 400 },
    );
  }

  const { data: createdRefund, error: refundInsertError } = await supabase
    .from("refunds")
    .insert({
      order_id: orderId,
      payment_id: paymentId,
      refund_status: "requested",
      refund_amount: refundAmount,
      refund_reason: refundReason,
      requested_by_user_id: userRow.id,
    })
    .select("id, order_id, payment_id, refund_status, refund_amount")
    .single();

  if (refundInsertError || !createdRefund) {
    return NextResponse.json(
      { ok: false, refundId: null, orderId: null, paymentId: null, message: "refund_request_insert_failed", errors: null },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      refundId: createdRefund.id,
      orderId: createdRefund.order_id,
      paymentId: createdRefund.payment_id,
      message: "Refund requested",
      errors: null,
    },
    { status: 200 },
  );
}

