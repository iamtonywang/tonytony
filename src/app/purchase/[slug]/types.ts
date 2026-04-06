import type { ProductMinimal } from "@/app/products/_server/types";

export type PurchasePageAggregateData = {
  product: ProductMinimal;
  buyerDefaults: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  receiverDefaults: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  addressDefaults: {
    zipcode: string | null;
    address1: string | null;
    address2: string | null;
  } | null;
  points: null;
  partnerOrReferral: null;
  purchasableStatus: {
    isPurchasable: boolean;
    reason: string | null;
  } | null;
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

