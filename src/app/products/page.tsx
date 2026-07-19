import Link from "next/link";
import { getPublicProducts } from "./_server/getPublicProducts";
import listStyles from "@/components/sections/Product/ProductListSection/ProductListSection.module.css";
import styles from "./page.module.css";

const FIXED_ORDER = ["nigajun-44"] as const;

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
      <section className={styles.brandIntro} aria-label="Brand introduction">
        <h1 className={styles.brandIntroBrand}>TONYWANG</h1>
        <p className={styles.brandIntroTitle}>
          Plant Cell Genetic Protein Laboratory
        </p>
        <p className={styles.brandIntroMeta}>August 2026 TONY WANG</p>
      </section>

      <div className={styles.brandIntroDivider} aria-hidden="true" />

      <section className={styles.productLinksSection} aria-label="Product links">
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
      </section>
    </>
  );
}
