import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundItem = {
  orderNumber: string | null;
  refundStatus: string;
  refundAmount: number | string;
  refundReason: string;
  requestedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  completedAt: string | null;
  paymentStatus: string | null;
  orderStatus: string | null;
};

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ ok: false, items: [], message: "Unauthorized" }, { status: 401 });
  }

  // users.id 내부 조회 (응답 노출 금지)
  const { data: usersRows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", userData.user.id)
    .limit(1);
  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json({ ok: false, items: [], message: "user_not_found" }, { status: 404 });
  }

  // 본인 환불 목록 (최신순)
  const { data: refundRows, error: refundErr } = await supabase
    .from("refunds")
    .select(
      "order_id, payment_id, refund_status, refund_amount, refund_reason, requested_at, approved_at, rejected_at, completed_at",
    )
    .eq("requested_by_user_id", userRow.id)
    .order("requested_at", { ascending: false });

  if (refundErr) {
    return NextResponse.json({ ok: false, items: [], message: "refunds_fetch_failed" }, { status: 500 });
  }

  const refunds = Array.isArray(refundRows) ? (refundRows as Array<{
    order_id: number | null;
    payment_id: number | null;
    refund_status: string;
    refund_amount: number | string;
    refund_reason: string;
    requested_at: string;
    approved_at: string | null;
    rejected_at: string | null;
    completed_at: string | null;
  }>) : [];

  if (refunds.length === 0) {
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const orderIds = Array.from(new Set(refunds.map((r) => r.order_id).filter((v): v is number => typeof v === "number")));
  const paymentIds = Array.from(new Set(refunds.map((r) => r.payment_id).filter((v): v is number => typeof v === "number")));

  // 주문 최소 정보 연결: order_number, order_status
  const { data: orderRows } = await supabase
    .from("orders")
    .select("id, order_number, order_status")
    .in("id", orderIds);
  const orderMap = new Map<number, { order_number: string | null; order_status: string | null }>();
  if (Array.isArray(orderRows)) {
    for (const row of orderRows as Array<{ id: number; order_number: string | null; order_status: string | null }>) {
      orderMap.set(row.id, { order_number: row.order_number ?? null, order_status: row.order_status ?? null });
    }
  }

  // 결제 최소 정보 연결: payment_status
  const { data: paymentRows } = await supabase
    .from("payments")
    .select("id, payment_status")
    .in("id", paymentIds);
  const paymentMap = new Map<number, string | null>();
  if (Array.isArray(paymentRows)) {
    for (const row of paymentRows as Array<{ id: number; payment_status: string | null }>) {
      paymentMap.set(row.id, row.payment_status ?? null);
    }
  }

  const items: RefundItem[] = refunds.map((r) => {
    const orderInfo = typeof r.order_id === "number" ? orderMap.get(r.order_id) : undefined;
    const paymentStatus = typeof r.payment_id === "number" ? (paymentMap.get(r.payment_id) ?? null) : null;

    return {
      orderNumber: orderInfo?.order_number ?? null,
      refundStatus: r.refund_status,
      refundAmount: r.refund_amount,
      refundReason: r.refund_reason,
      requestedAt: r.requested_at,
      approvedAt: r.approved_at ?? null,
      rejectedAt: r.rejected_at ?? null,
      completedAt: r.completed_at ?? null,
      paymentStatus,
      orderStatus: orderInfo?.order_status ?? null,
    };
  });

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

