import 'server-only';

export type ProductMinimal = {
  slug: string | null;
  productName: string | null;
  shortDescription: string | null;
  heroImageUrl: string | null;
  finalPriceAmount: number | null;
  productStatus: string | null;
  isVisible: boolean | null;
};

