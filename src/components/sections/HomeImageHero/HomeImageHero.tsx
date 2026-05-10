import styles from "./HomeImageHero.module.css";

export default function HomeImageHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} aria-hidden="true" />
    </section>
  );
}
