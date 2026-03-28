import 'server-only';

import type { ProductMinimal } from './types';

type RawProductRow = {
  slug?: string | null;
  product_name?: string | null;
  short_description?: string | null;
  product_status?: string | null;
  is_visible?: boolean | null;
  // Note: price/media relations are intentionally not included at this stage.
};

export function mapProductRowToMinimal(row: RawProductRow): ProductMinimal {
  return {
    slug: row?.slug ?? null,
    productName: row?.product_name ?? null,
    shortDescription: row?.short_description ?? null,
    heroImageUrl: null,
    finalPriceAmount: null,
    productStatus: row?.product_status ?? null,
    isVisible: row?.is_visible ?? null,
  };
}

type MergeExtras = {
  heroImageUrl?: string | null;
  finalPriceAmount?: number | null;
};

export function withMergedExtras(
  base: ProductMinimal,
  extras?: MergeExtras
): ProductMinimal {
  return {
    ...base,
    heroImageUrl:
      extras && typeof extras.heroImageUrl !== 'undefined'
        ? extras.heroImageUrl
        : base.heroImageUrl ?? null,
    finalPriceAmount:
      extras && typeof extras.finalPriceAmount !== 'undefined'
        ? extras.finalPriceAmount
        : base.finalPriceAmount ?? null,
  };
}

