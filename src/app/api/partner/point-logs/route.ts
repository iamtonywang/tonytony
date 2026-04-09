import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

type PointLogItem = {
  pointType: string;
  pointAmount: number | string;
  balanceAfter: number | string;
  occurredAt: string;
};

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerReadonlyClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ ok: false, items: [], message: "Unauthorized" }, { status: 401 });
  }

  // users.id 내부 조회 (응답 노출 금지)
  const { data: usersRows, error: usersErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", userData.user.id)
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
    // partner row가 없어도 성공 + 빈 목록 허용
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const { data: logRows, error: logsErr } = await supabase
    .from("partner_point_logs")
    .select("change_type, change_amount, balance_after, created_at")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false });

  if (logsErr) {
    return NextResponse.json({ ok: false, items: [], message: "point_logs_fetch_failed" }, { status: 500 });
  }

  const items: PointLogItem[] = Array.isArray(logRows)
    ? logRows.map((row) => ({
        pointType: row.change_type,
        pointAmount: row.change_amount,
        balanceAfter: row.balance_after,
        occurredAt: row.created_at,
      }))
    : [];

  return NextResponse.json({ ok: true, items, message: null }, { status: 200 });
}

