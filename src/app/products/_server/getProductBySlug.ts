import 'server-only';

import { getSupabasePublicClient } from './client';
import { mapProductRowToMinimal, withMergedExtras } from './productMappers';
import type { ProductMinimal, ProductSharedRow } from './types';

/**
 * Loads one publicly visible product by slug.
 * Then fetches active price and hero image via separate queries (no nested relations).
 */
export async function getProductBySlug(
  slug: string,
  sharedProductRow?: ProductSharedRow | null,
): Promise<ProductMinimal | null> {
  const totalStart = Date.now();
  const supabase = await getSupabasePublicClient();

  // 1) Base product
  let row: ProductSharedRow | null = sharedProductRow ?? null;
  const baseQueryStart = Date.now();
  if (row === null) {
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
    row = Array.isArray(data) && data.length > 0 ? (data[0] as ProductSharedRow) : null;
  }
  console.log(`[getProductBySlug] slug=${slug} base_query_ms=${Date.now() - baseQueryStart}`);
  if (!row) {
    console.log(`[getProductBySlug] slug=${slug} total_ms=${Date.now() - totalStart}`);
    return null;
  }

  const mappingStart = Date.now();
  const base = mapProductRowToMinimal(row);
  console.log(`[getProductBySlug] slug=${slug} map_base_ms=${Date.now() - mappingStart}`);

  // 2) Active price and hero image (run in parallel after base.id is known)
  let finalPriceAmount: number | null = null;
  let heroImageUrl: string | null = null;
  const pricesPromise = supabase
    .from('product_prices')
    .select('product_id, final_price_amount')
    .eq('product_id', row.id)
    .eq('is_active', true)
    .limit(2);
  const mediaPromise = supabase
    .from('product_media')
    .select('product_id, file_url, is_primary')
    .eq('product_id', row.id)
    .eq('media_type', 'hero_image')
    .eq('is_active', true)
    .limit(5);
  const extrasQueryStart = Date.now();
  const [pricesResult, mediaResult] = await Promise.all([
    pricesPromise,
    mediaPromise,
  ]);
  console.log(`[getProductBySlug] slug=${slug} extras_query_ms=${Date.now() - extrasQueryStart}`);

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

  const mergeStart = Date.now();
  const result = withMergedExtras(base, { finalPriceAmount, heroImageUrl });
  console.log(`[getProductBySlug] slug=${slug} merge_ms=${Date.now() - mergeStart}`);
  console.log(`[getProductBySlug] slug=${slug} total_ms=${Date.now() - totalStart}`);
  return result;
}

