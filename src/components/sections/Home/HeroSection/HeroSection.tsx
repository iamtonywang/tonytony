import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea} />
        <div className={styles.heroOverlay}>
          <h1>TONYWANG SCIENCE</h1>
          <p>Science-backed wellness for modern living.</p>
          <Link href="/products" className={styles.cta}>
            Explore Product
          </Link>
        </div>
      </div>
    </section>
  );
}
