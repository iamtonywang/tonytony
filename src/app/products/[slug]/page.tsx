import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return (
    <ProductDetailView>
      <ProductViewRouter slug={slug} />
    </ProductDetailView>
  );
}