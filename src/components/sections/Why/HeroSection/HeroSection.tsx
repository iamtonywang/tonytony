import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroInner}>
        <p className={styles.heroText}>WHY hero placeholder.</p>
      </div>
    </section>
  );
}
