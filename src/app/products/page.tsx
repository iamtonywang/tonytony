import Link from "next/link";
import { ProductListSection } from "@/components/sections/Product";
import { getPublicProducts } from "./_server/getPublicProducts";
import listStyles from "@/components/sections/Product/ProductListSection/ProductListSection.module.css";
import styles from "./page.module.css";

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
      <section className={styles.heroSection} aria-label="Product list editorial hero">
        <div className={styles.heroVisual}>
          <img
            src="/landing-assets/productlist-editorial-face-01.webp"
            alt=""
            className={styles.heroImage}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
          <div className={styles.heroOverlay}>
            <div className={styles.heroStaticBlock}>
              <div className={styles.heroStaticTitle}>TONYWANG</div>
              <div className={styles.heroSubLine}>plant cell genetic protein</div>
              <div className={styles.heroSubLine}>Institute Bio-Bioengineering</div>
              <div className={styles.heroSubLine}>식물세포유전자단백질</div>
              <div className={styles.heroSubLine}>바이오생명공학연구소</div>
              <div className={styles.heroSubLine}>My job is to develop a plant cell gene protein</div>
              <div className={styles.heroProductLinks}>
                <div className={listStyles.productTextOverlayVisible}>
                  <ul className={listStyles.productOverlayList}>
                    {filteredAndSorted.map((item) => {
                      if (!item.slug) return null;
                      return (
                        <li key={item.slug} className={listStyles.productOverlayItem}>
                          <Link
                            href={`/products/${item.slug}`}
                            className={listStyles.productOverlayLink}
                          >
                            {item.productName ?? ""}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={listStyles.productGlowLine} aria-hidden="true" />
      <ProductListSection />
    </>
  );
}
