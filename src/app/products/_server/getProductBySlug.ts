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

/**
 * Loads one publicly visible product by slug.
 * Then fetches active price and hero image via separate queries (no nested relations).
 */
export async function getProductBySlug(slug: string): Promise<ProductMinimal | null> {
  const supabase = await getSupabasePublicClient();

  // 1) Base product
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, product_name, short_description, product_status, is_visible')
    .eq('slug', slug)
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out'])
    .limit(1);

  if (error) {
    throw new Error(`Failed to load product by slug: ${error.message}`);
  }
  const row: ProductRowWithId | null = Array.isArray(data) && data.length > 0 ? (data[0] as ProductRowWithId) : null;
  if (!row) {
    return null;
  }

  const base = mapProductRowToMinimal(row);

  // 2) Active price and hero image (run in parallel after base.id is known)
  let finalPriceAmount: number | null = null;
  let heroImageUrl: string | null = null;
  const [pricesResult, mediaResult] = await Promise.all([
    supabase
      .from('product_prices')
      .select('product_id, final_price_amount')
      .eq('product_id', row.id)
      .eq('is_active', true)
      .limit(2),
    supabase
      .from('product_media')
      .select('product_id, file_url, is_primary')
      .eq('product_id', row.id)
      .eq('media_type', 'hero_image')
      .eq('is_active', true)
      .limit(5),
  ]);

  // prices fallback
  if (pricesResult.error) {
    console.error(`Failed to load active product price: ${pricesResult.error.message}`);
    finalPriceAmount = null;
  } else {
    const priceRows = Array.isArray(pricesResult.data) ? pricesResult.data : [];
    if (priceRows.length === 1) {
      finalPriceAmount = priceRows[0]?.final_price_amount ?? null;
    } else {
      finalPriceAmount = null;
    }
  }

  // media fallback
  if (mediaResult.error) {
    console.error(`Failed to load hero image media: ${mediaResult.error.message}`);
    heroImageUrl = null;
  } else {
    const list = Array.isArray(mediaResult.data) ? mediaResult.data : [];
    const primaries = list.filter((r) => r.is_primary === true && !!r.file_url);
    if (primaries.length === 1) {
      heroImageUrl = primaries[0]?.file_url ?? null;
    } else {
      heroImageUrl = null;
    }
  }

  return withMergedExtras(base, { finalPriceAmount, heroImageUrl });
}

