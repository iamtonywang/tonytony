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
  if (!receiverName) errors.receiverName = "수령인 이름을 입력해 주세요.";
  if (!receiverPhone) errors.receiverPhone = "수령인 연락처를 입력해 주세요.";
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
  if (!userRow || typeof userRow.id !== "number") {
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
  const buyerLoginIdSnapshot = (userRow.login_id ?? "").toString().trim();
  const buyerRealNameSnapshot = (buyerName || (profile?.real_name ?? "")).toString().trim() || null;
  const buyerPhoneSnapshot = (buyerPhone || (userRow.phone ?? "")).toString().trim();
  const buyerEmailSnapshot = (buyerEmail || (userRow.email ?? "")).toString().trim() || null;

  const receiverNameSnapshot = (receiverName || "").toString().trim();
  const receiverPhoneSnapshot = (receiverPhone || "").toString().trim();
  const receiverEmailSnapshot = (receiverEmail || (userRow.email ?? "")).toString().trim();

  const zipcodeSnapshot = (zipcode || (profile?.zipcode ?? "")).toString().trim();
  const address1Snapshot = (address1 || (profile?.address1 ?? "")).toString().trim();
  const address2Snapshot = (address2 || (profile?.address2 ?? "")).toString().trim() || null;

  const productSlugSnapshot = (productRow.slug || product.slug || "").toString().trim();
  const productNameSnapshot = (productRow.product_name || product.productName || "").toString().trim();

  // Success placeholder (no actual order creation)
  return NextResponse.json({
    ok: true,
    orderId: null,
    orderNumber: generatedOrderNumber,
    message: "Order payload normalized",
    errors: null,
    normalized: {
      userId: userRow.id,
      productId: productRow.id,
      currency: ORDER_CURRENCY,
      orderNumber: generatedOrderNumber,
      amounts: {
        unitPrice,
        subtotalAmount,
        discountAmount,
        pointUsedAmount: pointUsedAmountNorm,
        finalAmount,
        isPointPayment,
      },
      snapshots: {
        buyerLoginIdSnapshot,
        buyerRealNameSnapshot,
        buyerPhoneSnapshot,
        buyerEmailSnapshot,
        receiverNameSnapshot,
        receiverPhoneSnapshot,
        receiverEmailSnapshot,
        zipcodeSnapshot,
        address1Snapshot,
        address2Snapshot,
        productSlugSnapshot,
        productNameSnapshot,
      },
      initialStatus: {
        orderStatus: "pending",
        paymentStatus: "pending",
      },
    },
  });
}

