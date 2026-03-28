import {
  ProductBanner,
  ProductFilterSection,
  ProductHeroSection,
  ProductListSection,
} from "@/components/sections/Product";
import { getPublicProducts } from "./_server/getPublicProducts";

const FIXED_ORDER = [
  "nigajun-44",
  "nigajun-99",
  "nigajun-82",
  "nigajun-77",
  "nigajun-55",
  "nigajun-35",
  "nigajun-28",
  "nigajun-17",
] as const;

export default async function ProductsPage() {
  const products = await getPublicProducts();

  const orderMap = new Map<string, number>(
    FIXED_ORDER.map((slug, idx) => [slug, idx])
  );

  const filteredAndSorted = products
    .filter((p) => !!p.slug && orderMap.has(p.slug!))
    .sort((a, b) => {
      const ia = a.slug ? orderMap.get(a.slug) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const ib = b.slug ? orderMap.get(b.slug) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      return ia - ib;
    });

  return (
    <>
      <ProductHeroSection>
        <ProductListSection items={filteredAndSorted} />
      </ProductHeroSection>
      <ProductFilterSection />
      <ProductBanner />
    </>
  );
}
