import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ ok: false, items: [], message: "Unauthorized" }, { status: 401 });
  }

  const { data: usersRows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", userData.user.id)
    .limit(1);

  const userRow =
    Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json({ ok: false, items: [], message: "user_not_found" }, { status: 404 });
  }

  const { data: partnerRows } = await supabase
    .from("partners")
    .select("id")
    .eq("user_id", userRow.id)
    .limit(1);

  const partnerRow =
    Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;
  if (!partnerRow || typeof partnerRow.id !== "number") {
    return NextResponse.json({ ok: true, items: [], message: null }, { status: 200 });
  }

  const { data: requestRows, error: requestError } = await supabase
    .from("partner_settlement_requests")
    .select("id, partner_id, request_amount, request_status, requested_at, approved_at, rejected_at, paid_at")
    .eq("partner_id", partnerRow.id)
    .order("requested_at", { ascending: false });

  if (requestError) {
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

  const idToCount = new Map<number, number | null>();
  for (const requestRow of requests) {
    try {
      const { count } = await supabase
        .from("partner_settlement_request_items")
        .select("id", { count: "exact", head: true })
        .eq("request_id", requestRow.id);
      idToCount.set(requestRow.id, typeof count === "number" ? count : null);
    } catch {
      idToCount.set(requestRow.id, null);
    }
  }

  const items = requests.map((requestRow) => ({
    requestNumber: null as string | null,
    requestStatus: requestRow.request_status,
    requestedAmount: requestRow.request_amount,
    requestedAt: requestRow.requested_at,
    approvedAt: requestRow.approved_at ?? null,
    rejectedAt: requestRow.rejected_at ?? null,
    completedAt: requestRow.paid_at ?? null,
    itemCount: idToCount.get(requestRow.id) ?? null,
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
      return NextResponse.json({ ok: false, message: "?붿껌 媛?ν븳 ?뺤궛 嫄댁씠 ?놁뒿?덈떎." }, { status: 400 });
    }
    if (message.includes("partner_bank_account_not_found")) {
      return NextResponse.json({ ok: false, message: "?뺤궛 怨꾩쥖 ?뺣낫媛 ?놁뒿?덈떎." }, { status: 400 });
    }
    if (message.includes("partner_not_active_or_not_found")) {
      return NextResponse.json({ ok: false, message: "?쒖꽦 ?뚰듃?덈쭔 ?붿껌?????덉뒿?덈떎." }, { status: 403 });
    }
    if (message.includes("partner_user_not_found")) {
      return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
    }
    if (code === "23505" || message.includes("duplicate key value")) {
      return NextResponse.json({ ok: false, message: "?대? ?붿껌???뺤궛 嫄댁씠 ?ы븿?섏뼱 ?덉뒿?덈떎." }, { status: 409 });
    }

    return NextResponse.json({ ok: false, message: "settlement_request_create_failed" }, { status: 500 });
  }

  const resultRow =
    Array.isArray(data) && data.length === 1
      ? (data[0] as { requested_count: number | null; request_amount: number | string | null })
      : null;

  return NextResponse.json(
    {
      ok: true,
      requestedCount: resultRow?.requested_count ?? null,
      requestAmount: resultRow?.request_amount ?? null,
      message: null,
    },
    { status: 200 },
  );
}