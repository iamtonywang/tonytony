import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <section className={styles.heroVisualSection}>
        <div className={styles.heroImage} aria-hidden="true" />
      </section>
    </div>
  );
}
