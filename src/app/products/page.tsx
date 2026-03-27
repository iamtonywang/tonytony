import {
  ProductBanner,
  ProductFilterSection,
  ProductHeroSection,
  ProductListSection,
} from "@/components/sections/Product";

export default function ProductsPage() {
  return (
    <>
      <ProductHeroSection />
      <ProductFilterSection />
      <ProductListSection />
      <ProductBanner />
    </>
  );
}
