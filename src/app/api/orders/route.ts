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

  // Success placeholder (no actual order creation)
  return NextResponse.json({
    ok: true,
    orderId: null,
    message: "Order API skeleton validated",
    errors: null,
  });
}

