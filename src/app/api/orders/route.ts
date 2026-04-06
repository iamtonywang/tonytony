import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/app/products/_server/getProductBySlug";

type CreateOrderBody = {
  slug?: unknown;
  quantity?: unknown;
  buyerName?: unknown;
  buyerPhone?: unknown;
  buyerEmail?: unknown;
  receiverName?: unknown;
  receiverPhone?: unknown;
  receiverEmail?: unknown;
  zipcode?: unknown;
  address1?: unknown;
  address2?: unknown;
  paymentMethod?: unknown;
  pointUsedAmount?: unknown;
  agreeToTerms?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();

  // Session check
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json(
      { ok: false, orderId: null, message: "Unauthorized", errors: null },
      { status: 401 },
    );
  }

  // Parse body
  let body: CreateOrderBody;
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json(
      { ok: false, orderId: null, message: "잘못된 요청 형식입니다.", errors: null },
      { status: 400 },
    );
  }

  // Read fields
  const slug = isNonEmptyString(body?.slug) ? body.slug.trim() : "";
  const quantity = toNumberOrNull(body?.quantity);
  const buyerName = isNonEmptyString(body?.buyerName) ? body.buyerName.trim() : "";
  const buyerPhone = isNonEmptyString(body?.buyerPhone) ? body.buyerPhone.trim() : "";
  const buyerEmail = isNonEmptyString(body?.buyerEmail) ? body.buyerEmail.trim() : ""; // optional
  const receiverName = isNonEmptyString(body?.receiverName) ? body.receiverName.trim() : "";
  const receiverPhone = isNonEmptyString(body?.receiverPhone) ? body.receiverPhone.trim() : "";
  const receiverEmail = isNonEmptyString(body?.receiverEmail) ? body.receiverEmail.trim() : ""; // optional
  const zipcode = isNonEmptyString(body?.zipcode) ? body.zipcode.trim() : "";
  const address1 = isNonEmptyString(body?.address1) ? body.address1.trim() : "";
  const address2 = isNonEmptyString(body?.address2) ? body.address2.trim() : ""; // optional
  const paymentMethod = isNonEmptyString(body?.paymentMethod) ? body.paymentMethod.trim() : ""; // not validated against allow-list here
  const pointUsedAmount = toNumberOrNull(body?.pointUsedAmount); // optional
  const agreeToTerms = body?.agreeToTerms === true;

  // Minimal validation
  const errors: Record<string, string> = {};
  if (!slug) errors.slug = "상품 식별자(slug)가 필요합니다.";
  if (quantity === null || quantity < 1) errors.quantity = "수량은 1 이상이어야 합니다.";
  if (!buyerName) errors.buyerName = "주문자 이름을 입력해 주세요.";
  if (!buyerPhone) errors.buyerPhone = "주문자 연락처를 입력해 주세요.";
  // 현재 구매 UI는 단일 폼 구조이며 receiver snapshot은 buyer 입력값 기준으로 서버에서 동일 매핑한다.
  if (!zipcode) errors.zipcode = "우편번호를 입력해 주세요.";
  if (!address1) errors.address1 = "주소를 입력해 주세요.";
  if (agreeToTerms !== true) errors.agreeToTerms = "약관 동의가 필요합니다.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, orderId: null, message: "입력값 검증에 실패했습니다.", errors },
      { status: 400 },
    );
  }

  // Product lookup
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json(
      { ok: false, orderId: null, message: "상품을 찾을 수 없습니다.", errors: null },
      { status: 404 },
    );
  }

  // Minimal purchasable check (duplicated locally on purpose; do not couple to page util)
  const status = (product.productStatus ?? "").toLowerCase();
  const hasPrice = typeof product.finalPriceAmount === "number";
  const visible = product.isVisible === true;
  const hasSlug = !!product.slug;

  let purchasable = false;
  let reason: string | null = null;
  if (!hasSlug) {
    purchasable = false; reason = "missing_slug";
  } else if (!visible) {
    purchasable = false; reason = "invisible_product";
  } else if (!hasPrice) {
    purchasable = false; reason = "missing_price";
  } else if (status === "sold_out") {
    // Even if sold_out is publicly visible, actual purchase should be disallowed.
    purchasable = false; reason = "sold_out";
  } else if (status === "active") {
    purchasable = true; reason = null;
  } else {
    purchasable = false; reason = "unsupported_status";
  }

  if (!purchasable) {
    return NextResponse.json(
      { ok: false, orderId: null, message: `구매 불가능: ${reason ?? "unknown"}`, errors: null },
      { status: 400 },
    );
  }

  // ----------------------------------------------------------------------------
  // Normalization before insert (no DB writes in this step)
  // ----------------------------------------------------------------------------

  // 1) users: id, login_id, phone, email
  const uid = userData.user.id;
  const { data: userRows } = await supabase
    .from("users")
    .select("id, login_id, phone, email")
    .eq("auth_user_id", uid)
    .limit(1);
  const userRow = Array.isArray(userRows) && userRows.length === 1 ? userRows[0] as {
    id: number;
    login_id: string | null;
    phone: string | null;
    email: string | null;
  } : null;
  if (!userRow || typeof userRow.id !== "number" || !trimOrNull(userRow.login_id)) {
    return NextResponse.json(
      { ok: false, orderId: null, orderNumber: null, message: "user_not_found", errors: null },
      { status: 400 },
    );
  }

  // 2) user_profiles: real_name, zipcode, address1, address2
  const { data: profileRows } = await supabase
    .from("user_profiles")
    .select("real_name, zipcode, address1, address2")
    .eq("user_id", userRow.id)
    .limit(1);
  const profile = Array.isArray(profileRows) && profileRows.length === 1 ? profileRows[0] as {
    real_name: string | null;
    zipcode: string | null;
    address1: string | null;
    address2: string | null;
  } : null;

  // 3) products row for id + snapshots
  const { data: productRows } = await supabase
    .from("products")
    .select("id, slug, product_name, product_status, is_visible")
    .eq("slug", slug)
    .limit(1);
  const productRow = Array.isArray(productRows) && productRows.length === 1 ? productRows[0] as {
    id: number;
    slug: string | null;
    product_name: string | null;
    product_status: string | null;
    is_visible: boolean | null;
  } : null;

  if (!productRow || typeof productRow.id !== "number") {
    return NextResponse.json(
      { ok: false, orderId: null, orderNumber: null, message: "product_id_not_found", errors: null },
      { status: 400 },
    );
  }

  // 4) currency (temporary fixed)
  // 현재 레포에 통화 정책 부재로 인해 1차 임시 고정값. 추후 정책 확정 시 분리 필요
  const ORDER_CURRENCY = "KRW";

  // 5) order_number (temporary generation)
  // 현재 레포에 주문번호 정책 부재로 인한 1차 임시 생성 규칙. 실제 insert 단계 전 정책 재검토 필요
  const generatedOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // 6) amounts (minimal rule: no discounts/points, final=subtotal)
  // 현재 할인/포인트 정책 미구현 상태의 1차 최소 규칙
  const unitPrice = typeof product.finalPriceAmount === "number" ? product.finalPriceAmount : 0;
  const subtotalAmount = round2(unitPrice * (quantity ?? 1));
  const discountAmount = 0;
  const pointUsedAmountNorm = 0;
  const isPointPayment = false;
  const finalAmount = round2(subtotalAmount - discountAmount - pointUsedAmountNorm);

  // 7) snapshots (input first, then defaults fallback)
  const buyerLoginIdSnapshot = trimOrNull(userRow.login_id);
  const buyerRealNameSnapshot = trimOrNull(buyerName) ?? trimOrNull(profile?.real_name) ?? null;
  const buyerPhoneSnapshot = trimOrNull(buyerPhone) ?? trimOrNull(userRow.phone);
  const buyerEmailSnapshot = trimOrNull(buyerEmail) ?? trimOrNull(userRow.email) ?? null;

  const receiverNameSnapshot =
    trimOrNull(receiverName) ??
    trimOrNull(buyerName) ??
    trimOrNull(profile?.real_name) ??
    null;
  const receiverPhoneSnapshot =
    trimOrNull(receiverPhone) ??
    trimOrNull(buyerPhone) ??
    trimOrNull(userRow.phone);
  const receiverEmailSnapshot =
    trimOrNull(receiverEmail) ??
    trimOrNull(buyerEmail) ??
    trimOrNull(userRow.email) ??
    null;

  const zipcodeSnapshot = trimOrNull(zipcode) ?? trimOrNull(profile?.zipcode);
  const address1Snapshot = trimOrNull(address1) ?? trimOrNull(profile?.address1);
  const address2Snapshot = trimOrNull(address2) ?? trimOrNull(profile?.address2) ?? null;

  const productSlugSnapshot = (productRow.slug || product.slug || "").toString().trim();
  const productNameSnapshot = (productRow.product_name || product.productName || "").toString().trim();

  const snapshotErrors: Record<string, string> = {};
  if (!buyerLoginIdSnapshot) snapshotErrors.buyerLoginIdSnapshot = "required";
  if (!buyerPhoneSnapshot) snapshotErrors.buyerPhoneSnapshot = "required";
  if (!receiverNameSnapshot) snapshotErrors.receiverNameSnapshot = "required";
  if (!receiverPhoneSnapshot) snapshotErrors.receiverPhoneSnapshot = "required";
  if (!receiverEmailSnapshot) snapshotErrors.receiverEmailSnapshot = "required";
  if (!zipcodeSnapshot) snapshotErrors.zipcodeSnapshot = "required";
  if (!address1Snapshot) snapshotErrors.address1Snapshot = "required";
  if (Object.keys(snapshotErrors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        orderId: null,
        orderNumber: null,
        message: "snapshot_required_fields_missing",
        errors: snapshotErrors,
      },
      { status: 400 },
    );
  }

  const validatedQuantity = quantity as number;

  // orders insert (single row)
  const { data: createdOrder, error: orderInsertError } = await supabase
    .from("orders")
    .insert({
      user_id: userRow.id,
      order_number: generatedOrderNumber,
      order_status: "pending",
      payment_status: "pending",
      currency: ORDER_CURRENCY,
      subtotal_amount: subtotalAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      is_point_payment: isPointPayment,
      point_used_amount: pointUsedAmountNorm,
      buyer_login_id_snapshot: buyerLoginIdSnapshot,
      buyer_real_name_snapshot: buyerRealNameSnapshot,
      buyer_phone_snapshot: buyerPhoneSnapshot,
      buyer_email_snapshot: buyerEmailSnapshot,
      receiver_name: receiverNameSnapshot,
      receiver_phone: receiverPhoneSnapshot,
      receiver_email: receiverEmailSnapshot,
      zipcode: zipcodeSnapshot,
      address1: address1Snapshot,
      address2: address2Snapshot,
    })
    .select("id, order_number, order_status, payment_status")
    .single();

  if (orderInsertError || !createdOrder) {
    return NextResponse.json(
      {
        ok: false,
        orderId: null,
        orderNumber: null,
        message: "order_insert_failed",
        errors: null,
      },
      { status: 500 },
    );
  }

  // order_items insert (single row)
  const { data: createdOrderItem, error: orderItemInsertError } = await supabase
    .from("order_items")
    .insert({
      order_id: createdOrder.id,
      product_id: productRow.id,
      product_slug: productSlugSnapshot,
      product_name_snapshot: productNameSnapshot,
      unit_price: unitPrice,
      quantity: validatedQuantity,
      line_total_amount: subtotalAmount,
    })
    .select("id, order_id, product_id")
    .single();

  if (orderItemInsertError) {
    // 현재 단계는 transaction 미도입 상태의 최소 보정 처리이며,
    // 추후 RPC/transaction 구조 확정 시 대체 필요
    await supabase.from("orders").delete().eq("id", createdOrder.id);

    return NextResponse.json(
      {
        ok: false,
        orderId: null,
        orderNumber: null,
        message: "order_item_insert_failed",
        errors: null,
      },
      { status: 500 },
    );
  }

  // payments insert (pending only)
  // 현재 단계는 결제 요청 레코드 생성만 수행하며 실제 PG 승인/승인금액/거래ID는 후속 단계에서 반영
  const resolvedPaymentMethod = trimOrNull(paymentMethod) ?? "manual";
  const { data: createdPayment, error: paymentInsertError } = await supabase
    .from("payments")
    .insert({
      order_id: createdOrder.id,
      payment_method: resolvedPaymentMethod,
      payment_status: "pending",
      requested_amount: finalAmount,
    })
    .select("id, order_id")
    .single();

  if (paymentInsertError) {
    // 현재 단계는 transaction 미도입 상태의 최소 보정 처리이며 추후 transaction/RPC 구조로 대체 필요
    if (createdOrderItem?.id) {
      await supabase.from("order_items").delete().eq("id", createdOrderItem.id);
    } else {
      await supabase.from("order_items").delete().eq("order_id", createdOrder.id);
    }
    await supabase.from("orders").delete().eq("id", createdOrder.id);

    return NextResponse.json(
      {
        ok: false,
        orderId: null,
        orderNumber: null,
        message: "payment_insert_failed",
        errors: null,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: createdOrder.id,
    orderNumber: createdOrder.order_number,
    paymentId: createdPayment?.id ?? null,
    message: "Order created",
    errors: null,
  });
}

