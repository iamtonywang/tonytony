import Image from "next/image";
import Link from "next/link";
import SignatureLine from "@/components/sections/SignatureLine";
import { getPublicProducts } from "./_server/getPublicProducts";
import styles from "./page.module.css";

const FIXED_ORDER = [
  "nigajun-44",
  "nigajun-99",
  "nigajun-88",
  "nigajun-77",
  "nigajun-55",
  "nigajun-22",
  "nigajun-11",
  "nigajun-00",
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

      <section className={styles.hero} aria-label="Product collection portrait">
        <div className={styles.heroFadeX}>
          <div className={styles.heroFadeY}>
            <div className={styles.heroFadeShape}>
              <div className={styles.heroMedia}>
                <Image
                  src="/landing-assets/tonywang-products-hero-v2.webp"
                  alt="NIGAJUN product collection portrait"
                  fill
                  priority
                  sizes="(max-width: 768px) min(430px, 100vw), min(720px, 100vw)"
                  className={styles.heroImage}
                />
              </div>
              <div className={styles.heroScrim} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <SignatureLine />

      <section className={styles.productSelect} aria-label="NIGAJUN products">
        <h1 className={styles.productSelectTitle}>NIGAJUN</h1>
        <h2 className={styles.productSelectSubtitle}>I MADE IT FOR YOU.</h2>

        <ul className={styles.productGrid}>
          {filteredAndSorted.map((item) => {
            if (!item.slug) return null;
            const showComingSoon = item.slug !== "nigajun-44";
            return (
              <li key={item.slug} className={styles.productGridItem}>
                <Link href={`/products/${item.slug}`} className={styles.productGridLink}>
                  <span className={styles.productGridName}>{item.productName ?? ""}</span>
                  {showComingSoon ? (
                    <span className={styles.productGridComingSoon}>COMING SOON</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
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
