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
	const totalStart = Date.now();
	const clientStart = Date.now();
	const supabase = await getSupabasePublicClient();
	console.log("[supabase_client_create]", Date.now() - clientStart, "ms");

  // 1) Base products under public visibility constraints
  const queryStart = Date.now();
  const productsStart = Date.now();
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, product_name')
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out']);
  console.log("[products_query_only]", Date.now() - queryStart, "ms");
  console.log("[products_query]", Date.now() - productsStart, "ms");

  if (productsError) {
    console.error("Supabase error:", productsError.message);
    return [];
  }

  const productRows: ProductRowWithId[] = Array.isArray(products) ? products : [];
  console.log("[products_rows]", productRows.length);
  console.log(
    "[products_sample]",
    productRows.slice(0, 5).map((row) => ({
      id: row.id,
      slug: row.slug,
      product_name: row.product_name,
    }))
  );
  if (productRows.length === 0) {
    // 3) If no base products, do not run follow-up queries
    return [];
  }

  // Extract product_id set
  const productIds = productRows
    .map((p) => p.id)
    .filter((id): id is number => typeof id === 'number');
  console.log("[product_ids]", productIds.length);
  if (productIds.length === 0) {
    return [];
  }

  // 4) Map base rows into the stable ProductMinimal shape.
  const mergeStart = Date.now();
  const result: ProductMinimal[] = productRows.map((row) => {
    return mapProductRowToMinimal(row);
  });
  console.log("[merge_map]", Date.now() - mergeStart, "ms");

  // 8) Do not sort here (8 fixed order is page layer responsibility)
	console.log("[total]", Date.now() - totalStart, "ms");
  return result;
}

