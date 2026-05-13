import styles from "./page.module.css";

export default function WhyPage() {
  return (
    <div className={styles.whyRoot}>
      <section className={styles.cleanIntro}>
        <h1>TONY WANG</h1>
        <p>WHY INTERVIEW ARCHIVE</p>
      </section>
      <section
        className={styles.archiveShell}
        aria-label="Interview archive"
      />
    </div>
  );
}
