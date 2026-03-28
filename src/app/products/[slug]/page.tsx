import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";
import { getProductBySlug } from "../_server/getProductBySlug";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <ProductDetailView>
      <ProductViewRouter slug={slug} product={product ?? undefined} />
    </ProductDetailView>
  );
}