import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type Body = {
  slug?: unknown;
  content?: unknown;
};

const ELIGIBLE_ORDER_STATUSES = ["paid", "preparing", "shipped", "completed"] as const;
const BLOCKING_REFUND_STATUSES = ["approved", "completed"] as const;

/**
 * Picks the most recent order_id for the user+product that satisfies reviews_insert_own RLS
 * (paid-line order, no approved/completed refund). order_id is never taken from the client.
 */
async function resolveReviewOrderId(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  userId: number,
  productId: number,
): Promise<number | null> {
  const { data: itemRows, error: oiErr } = await supabase
    .from("order_items")
    .select("order_id")
    .eq("product_id", productId);

  if (oiErr || !Array.isArray(itemRows) || itemRows.length === 0) {
    return null;
  }

  const orderIdSet = new Set<number>();
  for (const r of itemRows as { order_id: number | string }[]) {
    const n = Number(r.order_id);
    if (Number.isFinite(n) && n > 0) orderIdSet.add(n);
  }
  const orderIds = [...orderIdSet];
  if (orderIds.length === 0) return null;

  const { data: orderRows, error: ordErr } = await supabase
    .from("orders")
    .select("id, created_at, order_status")
    .eq("user_id", userId)
    .in("id", orderIds)
    .in("order_status", [...ELIGIBLE_ORDER_STATUSES])
    .order("created_at", { ascending: false });

  if (ordErr || !Array.isArray(orderRows) || orderRows.length === 0) {
    return null;
  }

  for (const ord of orderRows as Array<{ id: number }>) {
    const oid = ord.id;
    const { data: refRows } = await supabase
      .from("refunds")
      .select("id")
      .eq("order_id", oid)
      .in("refund_status", [...BLOCKING_REFUND_STATUSES])
      .limit(1);

    if (Array.isArray(refRows) && refRows.length > 0) {
      continue;
    }
    return oid;
  }

  return null;
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid_json" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ ok: false, message: "slug_required" }, { status: 400 });
  }

  const rawContent = typeof body.content === "string" ? body.content : "";
  const content = rawContent.trim();
  if (content.length === 0) {
    return NextResponse.json({ ok: false, message: "content_required" }, { status: 400 });
  }

  const { data: userRows, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .limit(1);

  if (userErr || !Array.isArray(userRows) || userRows.length !== 1) {
    return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
  }

  const userId = (userRows[0] as { id: number }).id;

  const { data: prodRows, error: prodErr } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("is_visible", true)
    .in("product_status", ["active", "sold_out"])
    .limit(1);

  if (prodErr || !Array.isArray(prodRows) || prodRows.length !== 1) {
    return NextResponse.json({ ok: false, message: "product_not_found" }, { status: 404 });
  }

  const productId = (prodRows[0] as { id: number }).id;

  const orderId = await resolveReviewOrderId(supabase, userId, productId);
  if (orderId === null) {
    return NextResponse.json(
      { ok: false, message: "review_eligibility_failed" },
      { status: 403 },
    );
  }

  const { error: insErr } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: userId,
    order_id: orderId,
    content,
    is_private: false,
    review_status: "active",
  });

  if (insErr) {
    return NextResponse.json({ ok: false, message: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
