import 'server-only';

import { getSupabasePublicClient } from './client';
import { mapProductRowToMinimal, withMergedExtras } from './productMappers';
import type { ProductMinimal } from './types';

type PublicProductEmbedRow = {
  id?: number;
  slug?: string | null;
  product_name?: string | null;
  short_description?: string | null;
  product_status?: string | null;
  is_visible?: boolean | null;
  product_prices?: Array<{
    final_price_amount?: unknown;
    is_active?: boolean | null;
  }> | null;
};

function toFiniteNonNegativeNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

/**
 * Public product detail loader: one PostgREST embed (products + active product_prices).
 * No product_media; for `/products/[slug]` only.
 */
export async function getPublicProductDetailBySlug(
  slug: string,
): Promise<ProductMinimal | null> {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, product_name, short_description, product_status, is_visible, product_prices!fk_product_prices_product(final_price_amount,is_active)',
    )
    .eq('slug', slug)
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out'])
    .eq('product_prices.is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load public product detail: ${error.message}`);
    return null;
  }
  if (!data) {
    return null;
  }

  const row = data as PublicProductEmbedRow;
  const base = mapProductRowToMinimal(row);

  const priceRows = Array.isArray(row.product_prices) ? row.product_prices : [];
  let finalPriceAmount: number | null = null;
  if (priceRows.length === 1) {
    finalPriceAmount = toFiniteNonNegativeNumber(priceRows[0]?.final_price_amount);
  }

  return withMergedExtras(base, { finalPriceAmount, heroImageUrl: null });
}
