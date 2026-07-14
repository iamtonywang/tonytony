import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <div className={styles.hairline} aria-hidden />
      <section className={styles.statementSection} aria-label="Our Work statement">
        <p className={styles.statementLine}>I&apos;m evolving endlessly</p>
        <p className={styles.statementLine}>For what?</p>
        <p className={styles.statementLine}>To find a new innovative protein</p>
        <p className={`${styles.statementLine} ${styles.statementFinale}`}>
          August 2026 TONYWANG
        </p>
      </section>
      <div className={styles.hairline} aria-hidden />
    </div>
  );
}
