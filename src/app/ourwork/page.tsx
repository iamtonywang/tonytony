import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <div className={styles.hairline} aria-hidden />
      <section className={styles.statementSection} aria-label="Our Work statement">
        <p className={styles.statementLine}>TONY WANG</p>
        <p className={styles.statementLine}>OUR WORK</p>
        <p className={styles.statementLine}>
          Everyone experiences at least one crazy challenge in life.
        </p>
        <p className={styles.statementLine}>
          Countless sighs, tears, relentless failures, unbearable pain, hard-earned success, and
          moments of giving up...
        </p>
        <p className={styles.statementLine}>These are the paths that divide us.</p>
        <p className={styles.statementLine}>Yes, this is life.</p>
        <p className={styles.statementLine}>
          They are the marks left by time in the panoramic journey of every human life.
        </p>
        <p className={styles.statementLine}>
          Among the 8.2 billion people on this planet, each of us carries a story of failure and
          success.
        </p>
        <p className={styles.statementLine}>So, what is creation?</p>
        <p className={styles.statementLine}>
          To create, you have to be willing to go a little crazy.
        </p>
        <p className={styles.statementLine}>
          You have to build something the world has never seen before.
        </p>
      </section>
      <div className={`${styles.hairline} ${styles.hairlineBottom}`} aria-hidden />
    </div>
  );
}
