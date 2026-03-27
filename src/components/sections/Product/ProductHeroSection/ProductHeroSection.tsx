import styles from "./ProductHeroSection.module.css";

export default function ProductHeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroInner}>
        <h1 className={styles.title}>Product</h1>
        <p className={styles.subtitle}>Browse our currently available products.</p>
      </div>
    </section>
  );
}
