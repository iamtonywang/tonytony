import { NextRequest, NextResponse } from "next/server";

import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

type SettlementHistoryItem = {
  settlementStatus: string;
  settlementAmount: number | string;
  settlementAvailableAt: string | null;
  approvedAt: string | null;
  paidAt: string | null;
};

export async function GET(_req: NextRequest) {
  const headerSession = await getHeaderSession();
  if (!headerSession.authenticated || !headerSession.loginId) {
    return NextResponse.json({ ok: false, items: [], message: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getSupabaseServerReadonlyClient();

  // users.id 내부 조회 (응답 노출 금지)
  const { data: usersRows, error: usersErr } = await supabase
    .from("users")
    .select("id")
    .eq("login_id", headerSession.loginId)
    .limit(1);

  if (usersErr) {
    return NextResponse.json({ ok: false, items: [], message: "users_lookup_failed" }, { status: 500 });
  }

  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json({ ok: false, items: [], message: "user_not_found" }, { status: 404 });
  }

  // partners.id 내부 조회 (응답 노출 금지)
  const { data: partnerRows, error: partnerErr } = await supabase
    .from("partners")
    .select("id")
    .eq("user_id", userRow.id)
    .limit(1);

  if (partnerErr) {
    return NextResponse.json({ ok: false, items: [], message: "partner_lookup_failed" }, { status: 500 });
  }

  const partner = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;
  if (!partner || typeof partner.id !== "number") {
    // 파트너 row가 없어도 성공 응답 허용
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const { data: settlementRows, error: settlementErr } = await supabase
    .from("settlements")
    .select(
      "settlement_status, settlement_amount, settlement_available_at, settlement_confirmed_at, settlement_paid_at",
    )
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false });

  if (settlementErr) {
    return NextResponse.json({ ok: false, items: [], message: "settlements_fetch_failed" }, { status: 500 });
  }

  const items: SettlementHistoryItem[] = Array.isArray(settlementRows)
    ? settlementRows.map((row) => ({
        settlementStatus: row.settlement_status,
        settlementAmount: row.settlement_amount,
        settlementAvailableAt: row.settlement_available_at ?? null,
        approvedAt: row.settlement_confirmed_at ?? null,
        paidAt: row.settlement_paid_at ?? null,
      }))
    : [];

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

