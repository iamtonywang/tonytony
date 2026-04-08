import ProductDetailView from "./ProductDetailView";
import ProductViewRouter from "./ProductViewRouter";
import { getProductBySlug } from "../_server/getProductBySlug";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  return (
    <ProductDetailView>
      <ProductViewRouter slug={slug} product={product ?? undefined} />
    </ProductDetailView>
  );
}