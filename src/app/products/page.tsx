import Link from "next/link";
import SignatureLine from "@/components/sections/SignatureLine";
import { getPublicProducts } from "./_server/getPublicProducts";
import listStyles from "@/components/sections/Product/ProductListSection/ProductListSection.module.css";
import styles from "./page.module.css";

const FIXED_ORDER = [
  "nigajun-44",
  "nigajun-99",
  "nigajun-88",
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
      <SignatureLine />

      <section className={styles.brandIntro} aria-label="Brand introduction">
        <p className={styles.brandIntroTitle}>
          Plant Cell Genetic Protein Laboratory
        </p>
        <p className={styles.brandIntroMeta}>August 2026 TONY WANG</p>
      </section>

      <SignatureLine />

      <section className={styles.modelPortraitFrame} aria-label="Product links">
        <img
          src="/landing-assets/nigajun-44-model-portrait.webp"
          alt=""
          className={styles.modelPortrait}
        />

        <div className={styles.portraitOverlay}>
          <p className={styles.portraitLead}>I made it for you.</p>
          <p className={styles.portraitCopy}>
            Don&apos;t compare it to other cosmetics.
          </p>

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

      <SignatureLine />

      <section className={styles.brandIntro} aria-label="Brand introduction">
        <p className={styles.brandIntroTitle}>
          Plant Cell Genetic Protein Laboratory
        </p>
        <p className={styles.brandIntroMeta}>August 2026 TONY WANG</p>
      </section>

      <SignatureLine />
    </>
  );
}
