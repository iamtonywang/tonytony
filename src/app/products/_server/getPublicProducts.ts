import 'server-only';

import { getSupabaseServerClient } from './client';
import { mapProductRowToMinimal } from './productMappers';
import type { ProductMinimal } from './types';

/**
 * Lists publicly visible products.
 * Visibility criteria:
 * - is_visible = true
 * - product_status in ('active', 'sold_out')
 *
 * Note:
 * - Active price and primary hero image are NOT joined in this step to avoid
 *   unsafe/assumed relationship syntax. They will be added in a later step
 *   after confirming relationship query patterns. The fields are returned as null.
 */
export async function getPublicProducts(): Promise<ProductMinimal[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('slug, product_name, short_description, product_status, is_visible')
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out']);

  if (error) {
    throw new Error(`Failed to load public products: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  return rows.map(mapProductRowToMinimal);
}

