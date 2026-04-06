import 'server-only';

import { getProductBySlug } from "@/app/products/_server/getProductBySlug";
import type { PurchasePageAggregateData } from "../types";

export async function getPurchasePageData(slug: string): Promise<PurchasePageAggregateData | null> {
  const product = await getProductBySlug(slug);
  if (!product) {
    return null;
  }

  // TODO: 신규 조회 경로 필요: 사용자 기본값 / 주소 / 포인트 / 파트너·리퍼럴 / 구매가능상태
  return {
    product,
    buyerDefaults: null,
    receiverDefaults: null,
    addressDefaults: null,
    points: null,
    partnerOrReferral: null,
    purchasableStatus: null,
  };
}

