import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea} />
        <div className={styles.heroOverlay}>
          <p className={styles.heroText}>Hero section placeholder.</p>
        </div>
      </div>
    </section>
  );
}
