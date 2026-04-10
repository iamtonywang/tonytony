import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";

type PartnerStatusItem = {
  isPartner: boolean;
  partnerStatus: string | null;
  partnerCode: string | null;
  linkedCustomerCount: number | null;
  pendingApplicationExists: boolean | null;
};

export async function GET(_req: NextRequest) {
  const headerSession = await getHeaderSession();
  if (!headerSession.authenticated || !headerSession.loginId) {
    return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
  }

  // partners 최소 조회 (본인 연결 파트너)
  const { data: partnerRows, error: partnerErr } = await supabase
    .from("partners")
    .select("id, partner_status")
    .eq("user_id", userRow.id)
    .limit(1);

  if (partnerErr) {
    return NextResponse.json({ ok: false, item: null, message: "partner_fetch_failed" }, { status: 500 });
  }

  const partner =
    Array.isArray(partnerRows) && partnerRows.length === 1
      ? (partnerRows[0] as { id: number; partner_status: string | null })
      : null;

  // 기본 값 (파트너 행이 없어도 응답)
  let isPartner = false;
  let partnerStatus: string | null = null;
  let partnerCode: string | null = null;
  let linkedCustomerCount: number | null = null;
  let pendingApplicationExists: boolean | null = null;

  if (partner) {
    partnerStatus = partner.partner_status ?? null;
    // 활성 파트너 여부 정의: partner_status === 'active'
    isPartner = partner.partner_status === "active";

    // partnerCode: partner_codes 최신 1건 (created_at desc)
    try {
      const { data: codeRows } = await supabase
        .from("partner_codes")
        .select("referral_code, created_at")
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (Array.isArray(codeRows) && codeRows.length === 1) {
        const row = codeRows[0] as { referral_code: string | null; created_at: string };
        partnerCode = row.referral_code ?? null;
      } else {
        partnerCode = null;
      }
    } catch {
      partnerCode = null;
    }

    // linkedCustomerCount: 반드시 partners.id 기준 집계
    try {
      const { count } = await supabase
        .from("customer_partner_links")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partner.id);
      linkedCustomerCount = typeof count === "number" ? count : null;
    } catch {
      linkedCustomerCount = null;
    }
  }

  // pendingApplicationExists: partner_applications에 본인 user_id 기준 pending 존재 여부
  try {
    const { data: appRows } = await supabase
      .from("partner_applications")
      .select("id")
      .eq("user_id", userRow.id)
      .eq("application_status", "pending")
      .limit(1);
    if (Array.isArray(appRows)) {
      pendingApplicationExists = appRows.length > 0;
    } else {
      pendingApplicationExists = null;
    }
  } catch {
    pendingApplicationExists = null;
  }

  const item: PartnerStatusItem = {
    isPartner,
    partnerStatus,
    partnerCode,
    linkedCustomerCount,
    pendingApplicationExists,
  };

  return NextResponse.json({ ok: true, item, message: null }, { status: 200 });
}

