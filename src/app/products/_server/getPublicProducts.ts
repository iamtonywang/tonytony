import 'server-only';

import { getSupabasePublicClient } from './client';
import { mapProductRowToMinimal } from './productMappers';
import type { ProductMinimal } from './types';

type ProductRowWithId = {
  id: number;
  slug: string | null;
  product_name: string | null;
};

/**
 * Lists publicly visible products (no nested relations).
 * Then fetches prices and hero images with separate queries and merges them by product_id.
 */
export async function getPublicProducts(): Promise<ProductMinimal[]> {
	const supabase = await getSupabasePublicClient();

  // 1) Base products under public visibility constraints
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, product_name')
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

  // 4) Map base rows into the stable ProductMinimal shape.
  const result: ProductMinimal[] = productRows.map((row) => {
    return mapProductRowToMinimal(row);
  });

  // 8) Do not sort here (8 fixed order is page layer responsibility)
  return result;
}

