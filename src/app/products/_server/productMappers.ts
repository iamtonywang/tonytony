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
    // Price/media are not fetched in this step; keep them as null (no fake defaults).
    heroImageUrl: null,
    finalPriceAmount: null,
    productStatus: row?.product_status ?? null,
    isVisible: row?.is_visible ?? null,
  };
}

