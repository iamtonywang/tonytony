import styles from "./page.module.css";

export default function WhyPage() {
  return (
    <div className={styles.whyPage}>
      <div className={styles.topHairline} aria-hidden />
      <section className={styles.statementSection} aria-label="WHY statement">
        <div className={styles.titleGroup}>
          <p className={styles.statementLine}>TONY WANG</p>
          <p className={styles.statementLine}>WHY?</p>
        </div>
        <p className={styles.statementLine}>Who am I.</p>
        <p className={styles.statementLine}>What are you doing.</p>
        <p className={styles.statementLine}>What are you trying to show me</p>
        <p className={styles.statementLine}>What do you want to shout</p>
        <p className={styles.statementLine}>What are you trying to prove</p>
        <p className={styles.statementLine}>What are you trying to show me</p>
        <p className={styles.statementLine}>No, I.</p>
        <p className={styles.statementLine}>be about to become a legend</p>
        <p className={styles.statementLine}>a legend that no one can match</p>
        <p className={styles.statementLine}>And now I&apos;m starting to do it</p>
        <p className={styles.statementLine}>August 2026 TONY WANG</p>
      </section>
    </div>
  );
}
