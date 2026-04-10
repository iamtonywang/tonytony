import { NextRequest, NextResponse } from "next/server";

import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

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

export async function POST(_req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("create_partner_settlement_request_atomic");
  if (error) {
    const code = error.code ?? "";
    const message = error.message ?? "";

    if (message.includes("no_settlements_available")) {
      return NextResponse.json({ ok: false, message: "요청 가능한 정산 건이 없습니다." }, { status: 400 });
    }
    if (message.includes("partner_bank_account_not_found")) {
      return NextResponse.json({ ok: false, message: "정산 계좌 정보가 없습니다." }, { status: 400 });
    }
    if (message.includes("partner_not_active_or_not_found")) {
      return NextResponse.json({ ok: false, message: "활성 파트너만 요청할 수 있습니다." }, { status: 403 });
    }
    if (message.includes("partner_user_not_found")) {
      return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
    }
    if (code === "23505" || message.includes("duplicate key value")) {
      return NextResponse.json({ ok: false, message: "이미 요청된 정산 건이 포함되어 있습니다." }, { status: 409 });
    }

    return NextResponse.json({ ok: false, message: "settlement_request_create_failed" }, { status: 500 });
  }

  const row = Array.isArray(data) && data.length === 1
    ? (data[0] as { requested_count: number | null; request_amount: number | string | null })
    : null;

  return NextResponse.json(
    {
      ok: true,
      requestedCount: row?.requested_count ?? null,
      requestAmount: row?.request_amount ?? null,
      message: null,
    },
    { status: 200 },
  );
}
