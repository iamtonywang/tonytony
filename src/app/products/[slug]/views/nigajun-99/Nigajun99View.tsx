import styles from "./Nigajun99View.module.css";

export default function Nigajun99View() {
  return (
    <article className={styles.detailPage}>
      <section className={styles.heroSection}>
        <h1 className={styles.productTitle}>NIGAJUN 99</h1>
        <div className={styles.heroMediaSlot} aria-hidden="true" />
      </section>

      <section className={styles.coreInfoSection}>
        <h2 className={styles.sectionTitle}>Core Information</h2>
        <p className={styles.sectionText}>Core product information placeholder.</p>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.sectionTitle}>CTA</h2>
        <button type="button" className={styles.ctaButton} disabled>
          Coming Soon
        </button>
      </section>

      <section className={styles.boardSection}>
        <h2 className={styles.sectionTitle}>Board</h2>
        <p className={styles.sectionText}>Review and inquiry area placeholder.</p>
      </section>

      <section className={styles.informationSection}>
        <h2 className={styles.sectionTitle}>Information</h2>
        <p className={styles.sectionText}>Detailed information placeholder.</p>
      </section>
    </article>
  );
}