import 'server-only';

import { getProductBySlug } from "@/app/products/_server/getProductBySlug";
import type { PurchasePageAggregateData } from "../types";
import { getPurchaseUserDefaults } from "./getPurchaseUserDefaults";

export async function getPurchasePageData(slug: string): Promise<PurchasePageAggregateData | null> {
  const product = await getProductBySlug(slug);
  if (!product) {
    return null;
  }

  // Minimal purchasable status decision based on currently available product fields.
  // Note: SSOT states public visibility can be active/sold_out, but for actual purchase,
  // sold_out should not be purchasable. We treat sold_out as not purchasable here.
  const status = (product.productStatus ?? "").toLowerCase();
  const hasPrice = typeof product.finalPriceAmount === "number";
  const visible = product.isVisible === true;
  const hasSlug = !!product.slug;

  let isPurchasable = false;
  let reason: string | null = null;
  if (!hasSlug) {
    isPurchasable = false;
    reason = "missing_slug";
  } else if (!visible) {
    isPurchasable = false;
    reason = "invisible_product";
  } else if (!hasPrice) {
    isPurchasable = false;
    reason = "missing_price";
  } else if (status === "sold_out") {
    isPurchasable = false;
    reason = "sold_out";
  } else if (status === "active") {
    isPurchasable = true;
    reason = null;
  } else {
    isPurchasable = false;
    reason = "unsupported_status";
  }

  // Fetch user defaults if session is available; otherwise null-safe.
  const {
    buyerDefaults,
    receiverDefaults,
    addressDefaults,
  } = await getPurchaseUserDefaults().catch(() => ({
    buyerDefaults: null,
    receiverDefaults: null,
    addressDefaults: null,
  }));

  // TODO: 신규 조회 경로 필요: 포인트 / 파트너·리퍼럴
  return {
    product,
    buyerDefaults,
    receiverDefaults,
    addressDefaults,
    points: null,
    partnerOrReferral: null,
    purchasableStatus: {
      isPurchasable,
      reason,
    },
  };
}

