import Link from "next/link";
import styles from "./ProductHeroSection.module.css";
import listStyles from "../ProductListSection/ProductListSection.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface ProductHeroSectionProps {
  items?: ProductMinimal[] | null;
}

export default function ProductHeroSection({ items }: ProductHeroSectionProps) {
  const safeItems = items ?? [];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div className={styles.videoOverlay} aria-hidden="true">
            <img
              src="/landing-assets/login-bg-main.webp"
              alt=""
              className={styles.overlayImage}
            />
          </div>
        </div>
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
                  {safeItems.map((item) => {
                    if (!item.slug) return null;
                    return (
                      <li key={item.slug} className={listStyles.productOverlayItem}>
                        <Link href={`/products/${item.slug}`} className={listStyles.productOverlayLink}>
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
  );
}
