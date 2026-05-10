import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection} aria-label="Home visual placeholder">
      <div className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
