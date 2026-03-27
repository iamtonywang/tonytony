import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <ProductDetailView>
      <ProductViewRouter slug={params.slug} />
    </ProductDetailView>
  );
}