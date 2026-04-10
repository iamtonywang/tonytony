import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";

type OrderItem = {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  finalAmount: number | string;
  orderedAt: string;
  refundExists: boolean;
  refundStatus: string | null;
  paymentMethod: string | null;
};

export async function GET(_req: NextRequest) {
  const headerSession = await getHeaderSession();
  if (!headerSession.authenticated || !headerSession.loginId) {
    return NextResponse.json({ ok: false, items: [], message: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getSupabaseServerReadonlyClient();

  // users.id 내부 조회 (응답 노출 금지)
  const { data: usersRows } = await supabase
    .from("users")
    .select("id")
    .eq("login_id", headerSession.loginId)
    .limit(1);
  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json({ ok: false, items: [], message: "user_not_found" }, { status: 404 });
  }

  // 본인 주문 목록 (최신순)
  const { data: orderRows, error: orderErr } = await supabase
    .from("orders")
    .select("id, order_number, order_status, payment_status, final_amount, ordered_at")
    .eq("user_id", userRow.id)
    .order("ordered_at", { ascending: false });

  if (orderErr) {
    return NextResponse.json({ ok: false, items: [], message: "orders_fetch_failed" }, { status: 500 });
  }

  const orders = Array.isArray(orderRows) ? (orderRows as Array<{
    id: number;
    order_number: string;
    order_status: string;
    payment_status: string;
    final_amount: number | string;
    ordered_at: string;
  }>) : [];

  if (orders.length === 0) {
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const orderIds = orders.map((o) => o.id);

  // 결제 정보: payment_method (nullable)
  const { data: paymentRows } = await supabase
    .from("payments")
    .select("id, order_id, payment_method")
    .in("order_id", orderIds);
  const orderIdToPaymentMethod = new Map<number, string | null>();
  if (Array.isArray(paymentRows)) {
    for (const row of paymentRows as Array<{ id: number; order_id: number; payment_method: string | null }>) {
      // 동일 주문에 여러 결제 레코드가 있을 수 있으나, 여기서는 임시로 첫 값만 사용
      if (!orderIdToPaymentMethod.has(row.order_id)) {
        orderIdToPaymentMethod.set(row.order_id, row.payment_method ?? null);
      }
    }
  }

  // 환불 정보: 존재 여부 + 대표 상태 (nullable)
  const { data: refundRows } = await supabase
    .from("refunds")
    .select("id, order_id, refund_status, created_at")
    .in("order_id", orderIds);
  const orderIdToRefundStatus = new Map<number, string | null>();
  const orderIdHasRefund = new Map<number, boolean>();
  if (Array.isArray(refundRows)) {
    // 가장 최근 생성 기준 1개 상태만 대표로 사용 (상세 목록은 RefundsSection 전용 API에서 처리)
    const grouped = new Map<number, Array<{ refund_status: string | null; created_at: string }>>();
    for (const row of refundRows as Array<{ id: number; order_id: number; refund_status: string | null; created_at: string }>) {
      orderIdHasRefund.set(row.order_id, true);
      const arr = grouped.get(row.order_id) ?? [];
      arr.push({ refund_status: row.refund_status ?? null, created_at: row.created_at });
      grouped.set(row.order_id, arr);
    }
    for (const [oid, arr] of grouped) {
      arr.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      orderIdToRefundStatus.set(oid, arr[0]?.refund_status ?? null);
    }
  }

  const items: OrderItem[] = orders.map((o) => ({
    orderNumber: o.order_number,
    orderStatus: o.order_status,
    paymentStatus: o.payment_status,
    finalAmount: o.final_amount,
    orderedAt: o.ordered_at,
    refundExists: orderIdHasRefund.get(o.id) === true,
    refundStatus: orderIdToRefundStatus.has(o.id) ? (orderIdToRefundStatus.get(o.id) ?? null) : null,
    paymentMethod: orderIdToPaymentMethod.has(o.id) ? (orderIdToPaymentMethod.get(o.id) ?? null) : null,
  }));

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

