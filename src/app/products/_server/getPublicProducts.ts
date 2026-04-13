import 'server-only';

import { getSupabasePublicClient } from './client';
import { mapProductRowToMinimal, withMergedExtras } from './productMappers';
import type { ProductMinimal } from './types';

type ProductRowWithId = {
  id: number;
  slug: string | null;
  product_name: string | null;
  short_description: string | null;
  product_status: string | null;
  is_visible: boolean | null;
};

type PriceRow = {
  product_id: number;
  final_price_amount: number | null;
};

type MediaRow = {
  product_id: number;
  file_url: string | null;
  is_primary: boolean | null;
};

/**
 * Lists publicly visible products (no nested relations).
 * Then fetches prices and hero images with separate queries and merges them by product_id.
 */
export async function getPublicProducts(): Promise<ProductMinimal[]> {
	const totalStart = Date.now();
	const supabase = await getSupabasePublicClient();

  // 1) Base products under public visibility constraints
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, product_name, short_description, product_status, is_visible')
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out']);

  if (productsError) {
    console.error("Supabase error:", productsError.message);
    return [];
  }

  const productRows: ProductRowWithId[] = Array.isArray(products) ? products : [];
  if (productRows.length === 0) {
    // 3) If no base products, do not run follow-up queries
    return [];
  }

  // Extract product_id set
  const productIds = productRows
    .map((p) => p.id)
    .filter((id): id is number => typeof id === 'number');
  if (productIds.length === 0) {
    return [];
  }

	// 4) Active prices and hero images by product_id (run in parallel)
	const promiseStart = Date.now();
	const [pricesResult, mediaResult] = await Promise.all([
		supabase
			.from('product_prices')
			.select('product_id, final_price_amount')
			.in('product_id', productIds)
			.eq('is_active', true),
		supabase
			.from('product_media')
			.select('product_id, file_url, is_primary')
			.in('product_id', productIds)
			.eq('media_type', 'hero_image')
			.eq('is_active', true),
	]);
	console.log("[promise_all]", Date.now() - promiseStart, "ms");

	// prices fallback
	const prices: PriceRow[] = pricesResult.error
		? (console.error(`Failed to load active product prices: ${pricesResult.error.message}`), [])
		: (Array.isArray(pricesResult.data) ? pricesResult.data : []);
  const priceByProductId = new Map<number, number | null>();
  // Unique active per product is enforced; if multiple appear, last write wins but should not happen.
  for (const pr of prices) {
    if (typeof pr.product_id === 'number') {
      priceByProductId.set(pr.product_id, pr.final_price_amount ?? null);
    }
  }

	// 5) Hero image candidates by product_id (fallback)
	const medias: MediaRow[] = mediaResult.error
		? (console.error(`Failed to load hero image media: ${mediaResult.error.message}`), [])
		: (Array.isArray(mediaResult.data) ? mediaResult.data : []);

  // Build primary-only map; if not exactly one primary per product, keep null.
  const heroImageByProductId = new Map<number, string | null>();
  {
    const grouped = new Map<number, MediaRow[]>();
    for (const m of medias) {
      if (typeof m.product_id === 'number') {
        const arr = grouped.get(m.product_id) ?? [];
        arr.push(m);
        grouped.set(m.product_id, arr);
      }
    }
    for (const [pid, arr] of grouped.entries()) {
      const primaries = arr.filter((r) => r.is_primary === true && !!r.file_url);
      if (primaries.length === 1) {
        heroImageByProductId.set(pid, primaries[0].file_url ?? null);
      } else {
        // Multiple or none -> do not choose arbitrarily
        heroImageByProductId.set(pid, null);
      }
    }
  }

  // 6) Merge by product_id into minimal shape
  const result: ProductMinimal[] = productRows.map((row) => {
    const base = mapProductRowToMinimal(row);
    const finalPriceAmount = priceByProductId.has(row.id)
      ? priceByProductId.get(row.id) ?? null
      : null;
    const heroImageUrl = heroImageByProductId.has(row.id)
      ? heroImageByProductId.get(row.id) ?? null
      : null;
    return withMergedExtras(base, { finalPriceAmount, heroImageUrl });
  });

  // 8) Do not sort here (8 fixed order is page layer responsibility)
	console.log("[total]", Date.now() - totalStart, "ms");
  return result;
}

