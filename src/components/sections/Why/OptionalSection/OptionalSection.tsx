import styles from "./OptionalSection.module.css";

export default function OptionalSection() {
  return (
    <section className={styles.optionalSection}>
      <div className={styles.whyBottomCopy}>
        <p className={styles.whyBottomTitle}></p>
        <p className={styles.whyBottomSubTitle}></p>
        <p className={styles.whyBottomLine}></p>
        <p className={styles.whyBottomLine}></p>
      </div>
      <div className={styles.whyEndGlowLine} aria-hidden="true" />
    </section>
  );
}
