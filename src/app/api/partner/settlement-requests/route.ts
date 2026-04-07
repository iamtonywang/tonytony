import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type SettlementRequestItem = {
  requestNumber: string | null;
  requestStatus: string;
  requestedAmount: number | string;
  requestedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  completedAt: string | null;
  itemCount: number | null;
};

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  // auth
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

  // partners.id 내부 조회 (응답 노출 금지)
  const { data: partnerRows } = await supabase
    .from("partners")
    .select("id")
    .eq("user_id", userRow.id)
    .limit(1);
  const partner = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;

  if (!partner || typeof partner.id !== "number") {
    // 파트너 행이 없어도 응답 가능해야 함
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  // 본인 파트너의 정산 요청 목록 (최신순)
  const { data: requestRows, error: reqErr } = await supabase
    .from("partner_settlement_requests")
    .select("id, partner_id, request_amount, request_status, requested_at, approved_at, rejected_at, paid_at")
    .eq("partner_id", partner.id)
    .order("requested_at", { ascending: false });

  if (reqErr) {
    return NextResponse.json({ ok: false, items: [], message: "settlement_requests_fetch_failed" }, { status: 500 });
  }

  const requests = Array.isArray(requestRows)
    ? (requestRows as Array<{
        id: number;
        partner_id: number;
        request_amount: number | string;
        request_status: string;
        requested_at: string;
        approved_at: string | null;
        rejected_at: string | null;
        paid_at: string | null;
      }>)
    : [];

  if (requests.length === 0) {
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  // itemCount 집계: request_id = settlement_request.id 기준으로 count(*)
  // JOIN 으로 row 확장 금지 → 개별 head count 또는 별도 집계 조회 수행
  const idToCount = new Map<number, number | null>();
  for (const r of requests) {
    try {
      const { count } = await supabase
        .from("partner_settlement_request_items")
        .select("id", { count: "exact", head: true })
        .eq("request_id", r.id);
      idToCount.set(r.id, typeof count === "number" ? count : null);
    } catch {
      idToCount.set(r.id, null);
    }
  }

  const items: SettlementRequestItem[] = requests.map((r) => ({
    // 표시용 식별 컬럼이 DDL에 없으므로 항상 null
    requestNumber: null,
    requestStatus: r.request_status,
    requestedAmount: r.request_amount,
    requestedAt: r.requested_at,
    approvedAt: r.approved_at ?? null,
    rejectedAt: r.rejected_at ?? null,
    // completedAt은 paid_at을 매핑
    completedAt: r.paid_at ?? null,
    itemCount: idToCount.get(r.id) ?? null,
  }));

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

