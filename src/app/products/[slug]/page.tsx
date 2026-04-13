import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";
import { getProductBySlug } from "../_server/getProductBySlug";
import { getProductBoardBySlug } from "../_server/getProductBoardBySlug";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const promiseAllStart = Date.now();
  const [product, boardItems] = await Promise.all([
    getProductBySlug(slug),
    getProductBoardBySlug(slug),
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