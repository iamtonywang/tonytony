import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type ConfirmPaymentBody = {
  orderId?: unknown;
  paymentId?: unknown;
  transactionId?: unknown;
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "Unauthorized", errors: null },
      { status: 401 },
    );
  }

  let body: ConfirmPaymentBody;
  try {
    body = (await req.json()) as ConfirmPaymentBody;
  } catch {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "잘못된 요청 형식입니다.", errors: null },
      { status: 400 },
    );
  }

  const orderId = toNumberOrNull(body?.orderId);
  const paymentId = toNumberOrNull(body?.paymentId);
  const transactionId = trimOrNull(body?.transactionId);

  const errors: Record<string, string> = {};
  if (orderId === null) errors.orderId = "required";
  if (paymentId === null) errors.paymentId = "required";
  if (!transactionId) errors.transactionId = "required";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "입력값 검증에 실패했습니다.", errors },
      { status: 400 },
    );
  }

  const { data: usersRows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", userData.user.id)
    .limit(1);
  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "user_not_found", errors: null },
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
      { ok: false, paymentId: null, orderId: null, message: "order_not_found", errors: null },
      { status: 404 },
    );
  }

  const { data: paymentRows } = await supabase
    .from("payments")
    .select("id, order_id, payment_status, requested_amount, approved_amount, transaction_id, approved_at")
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
      transaction_id: string | null;
      approved_at: string | null;
    })
    : null;
  if (!paymentRow) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "payment_not_found", errors: null },
      { status: 404 },
    );
  }

  if (paymentRow.payment_status !== "pending") {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "payment_not_pending", errors: null },
      { status: 400 },
    );
  }

  if (orderRow.payment_status !== "pending" || orderRow.order_status !== "pending") {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "order_not_pending", errors: null },
      { status: 400 },
    );
  }

  if (!transactionId) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "invalid_transaction_id", errors: null },
      { status: 400 },
    );
  }

  const requestedAmount = toNumberOrNull(paymentRow.requested_amount);
  const finalAmount = toNumberOrNull(orderRow.final_amount);
  if (requestedAmount === null || finalAmount === null || round2(requestedAmount) !== round2(finalAmount)) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "amount_mismatch", errors: null },
      { status: 400 },
    );
  }

  const approvedAt = new Date().toISOString();
  const { data: updatedPayment, error: paymentConfirmError } = await supabase
    .from("payments")
    .update({
      payment_status: "success",
      approved_amount: requestedAmount,
      transaction_id: transactionId,
      approved_at: approvedAt,
    })
    .eq("id", paymentRow.id)
    .eq("order_id", orderRow.id)
    .select("id, order_id, payment_status, approved_amount, transaction_id, approved_at")
    .single();
  if (paymentConfirmError || !updatedPayment) {
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "payment_confirm_failed", errors: null },
      { status: 500 },
    );
  }

  const { data: updatedOrder, error: orderSyncError } = await supabase
    .from("orders")
    .update({
      payment_status: "success",
      order_status: "paid",
      paid_at: approvedAt,
    })
    .eq("id", orderRow.id)
    .select("id, order_status, payment_status, paid_at")
    .single();

  if (orderSyncError || !updatedOrder) {
    // 현재 단계는 transaction 미도입 상태의 최소 보정 처리이며 추후 transaction/RPC 구조로 대체 필요
    await supabase
      .from("payments")
      .update({
        payment_status: "pending",
        approved_amount: null,
        transaction_id: null,
        approved_at: null,
      })
      .eq("id", paymentRow.id)
      .eq("order_id", orderRow.id);

    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "order_status_sync_failed", errors: null },
      { status: 500 },
    );
  }

  // 현재 route 는 orders 동기화 실패 시 payments pending 복구를 수행하므로,
  // payment_events 는 최종 상태 확정 이후에만 적재한다.
  const paymentEventPayload = {
    paymentId: updatedPayment.id,
    orderId: updatedOrder.id,
    transactionId: updatedPayment.transaction_id,
    requested_amount: requestedAmount,
    approved_amount: updatedPayment.approved_amount,
    payment_status: updatedPayment.payment_status,
    order_status: updatedOrder.order_status,
    approved_at: updatedPayment.approved_at,
  };

  const { error: paymentEventInsertError } = await supabase
    .from("payment_events")
    .insert({
      payment_id: updatedPayment.id,
      event_type: "payment_confirmed",
      raw_payload: paymentEventPayload,
    });

  if (paymentEventInsertError) {
    // 현재 단계는 event log 적재 실패를 별도 실패로 반환하며,
    // 추후 transaction/RPC/webhook 구조 확정 시 재설계 필요
    return NextResponse.json(
      { ok: false, paymentId: null, orderId: null, message: "payment_event_insert_failed", errors: null },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      paymentId: updatedPayment.id,
      orderId: updatedOrder.id,
      message: "Payment confirmed",
      errors: null,
    },
    { status: 200 },
  );
}

