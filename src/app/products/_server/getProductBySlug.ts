import 'server-only';

import { getSupabaseServerClient } from './client';
import { mapProductRowToMinimal } from './productMappers';
import type { ProductMinimal } from './types';

/**
 * Loads a single publicly visible product by slug.
 * Visibility criteria:
 * - is_visible = true
 * - product_status in ('active', 'sold_out')
 *
 * Returns null when no matching product exists.
 * Price and primary hero image are left null in this step (see getPublicProducts note).
 */
export async function getProductBySlug(slug: string): Promise<ProductMinimal | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('slug, product_name, short_description, product_status, is_visible')
    .eq('slug', slug)
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out'])
    .limit(1);

  if (error) {
    throw new Error(`Failed to load product by slug: ${error.message}`);
  }

  const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
  if (!row) {
    return null;
  }
  return mapProductRowToMinimal(row);
}

