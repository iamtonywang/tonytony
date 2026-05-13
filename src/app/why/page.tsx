import styles from "./page.module.css";

export default function WhyPage() {
  return (
    <div className={styles.whyPage}>
      <section className={styles.whyLanding} aria-label="WHY landing">
        <div className={styles.whyLandingTopLine} aria-hidden />
        <div className={styles.whyLandingInner}>
          <h1 className={styles.whyLandingTitle}>TONY WANG</h1>
          <p className={styles.whyLandingSub}>WHY INTERVIEW ARCHIVE</p>
        </div>
      </section>

      <section
        className={styles.transitionSection}
        aria-label="Transition editorial"
      >
        <div className={styles.transitionNoise} aria-hidden />
        <div className={styles.transitionGlow} aria-hidden />

        <div className={styles.transitionInner}>
          <div className={styles.statementWrap}>
            <p className={styles.statementLine}>WHY IS NOT A STORY.</p>
            <p className={`${styles.statementLine} ${styles.statementLineMuted}`}>
              IT IS A RECORD OF 28 YEARS.
            </p>
          </div>

          <div className={styles.hairlineShort} aria-hidden />

          <div className={styles.subCopy}>
            <p className={styles.subLine}>THIS IS NOT MARKETING.</p>
            <p className={`${styles.subLine} ${styles.subLineMuted}`}>
              THIS IS AN INTERVIEW ARCHIVE.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.archiveSection} aria-label="Interview archive" />

      <div className={styles.bodySpacer} aria-hidden />
    </div>
  );
}
