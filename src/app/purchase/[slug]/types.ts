import type { ProductMinimal } from "@/app/products/_server/types";

export type PurchasePageAggregateData = {
  product: ProductMinimal;
  buyerDefaults: null;
  receiverDefaults: null;
  addressDefaults: null;
  points: null;
  partnerOrReferral: null;
  purchasableStatus: null;
};

// This payload defines only client-side form inputs for the skeleton.
// Server-confirmed values (prices, statuses, partner/referral, etc.) are intentionally excluded.
export type CreateOrderPayload = {
  slug: string;
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  zipcode: string;
  address1: string;
  address2: string;
  paymentMethod: string;
  pointUsedAmount: number;
  agreeToTerms: boolean;
};

