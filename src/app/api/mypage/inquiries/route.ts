import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

type InquiryItem = {
  inquiryType: string | null;
  inquiryStatus: string;
  subject: string;
  createdAt: string;
  answeredAt: string | null;
  orderNumber: string | null;
};

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerReadonlyClient();

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

  // 본인 문의 목록 (DDL 기준 실제 컬럼: user_id, order_id, title, inquiry_status, created_at, answered_at)
  const { data: inquiryRows, error: inquiryErr } = await supabase
    .from("inquiries")
    .select("order_id, title, inquiry_status, created_at, answered_at")
    .eq("user_id", userRow.id)
    .order("created_at", { ascending: false });

  if (inquiryErr) {
    return NextResponse.json({ ok: false, items: [], message: "inquiries_fetch_failed" }, { status: 500 });
  }

  const inquiries = Array.isArray(inquiryRows) ? (inquiryRows as Array<{
    order_id: number | null;
    title: string;
    inquiry_status: string;
    created_at: string;
    answered_at: string | null;
  }>) : [];

  if (inquiries.length === 0) {
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const orderIds = Array.from(
    new Set(inquiries.map((i) => i.order_id).filter((v): v is number => typeof v === "number")),
  );

  // 주문 연결이 있는 경우에만 order_number 최소 포함
  const { data: orderRows } = await supabase
    .from("orders")
    .select("id, order_number")
    .in("id", orderIds);
  const orderNumberMap = new Map<number, string | null>();
  if (Array.isArray(orderRows)) {
    for (const row of orderRows as Array<{ id: number; order_number: string | null }>) {
      orderNumberMap.set(row.id, row.order_number ?? null);
    }
  }

  const items: InquiryItem[] = inquiries.map((i) => ({
    // final_ddl.sql의 inquiries 테이블에는 "type" 컬럼이 없어 현재 단계에서는 null로 고정
    inquiryType: null,
    inquiryStatus: i.inquiry_status,
    subject: i.title,
    createdAt: i.created_at,
    answeredAt: i.answered_at ?? null,
    orderNumber: typeof i.order_id === "number" ? (orderNumberMap.get(i.order_id) ?? null) : null,
  }));

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

