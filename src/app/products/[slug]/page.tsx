import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";
import { getProductBySlug } from "../_server/getProductBySlug";
import { getProductBoardBySlug } from "../_server/getProductBoardBySlug";
import { getSupabasePublicClient } from "../_server/client";
import type { ProductSharedRow } from "../_server/types";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const supabase = await getSupabasePublicClient();
  const { data: productRows, error: productErr } = await supabase
    .from("products")
    .select("id, slug, product_name, short_description, product_status, is_visible")
    .eq("slug", slug)
    .eq("is_visible", true)
    .in("product_status", ["active", "sold_out"])
    .limit(1);
  const sharedProductRow: ProductSharedRow | null =
    !productErr && Array.isArray(productRows) && productRows.length > 0
      ? (productRows[0] as ProductSharedRow)
      : null;
  if (sharedProductRow === null) {
    notFound();
  }

  const promiseAllStart = Date.now();
  const [product, boardItems] = await Promise.all([
    getProductBySlug(slug, sharedProductRow),
    getProductBoardBySlug(slug, sharedProductRow),
  ]);
  console.log(`[detail_page_promise_all] ${Date.now() - promiseAllStart} ms`);

  if (product === null) {
    notFound();
  }

  return (
    <ProductDetailView>
      <ProductViewRouter slug={slug} product={product ?? undefined} boardItems={boardItems} />
    </ProductDetailView>
  );
}