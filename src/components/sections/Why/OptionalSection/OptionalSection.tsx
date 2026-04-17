import styles from "./OptionalSection.module.css";

export default function OptionalSection() {
  return (
    <section className={styles.optionalSection}>
      <div className={styles.whyBottomCopy}>
        <p className={styles.whyBottomTitle}>TONYWANG</p>
        <p className={styles.whyBottomSubTitle}>Why</p>
        <p className={styles.whyBottomLine}>
          We question every formula, every claim, and every shortcut that cannot be proven in real biological context.
        </p>
        <p className={styles.whyBottomLine}>
          Why exists to show that scientific integrity and true skin recovery must be built on evidence, not trends.
        </p>
      </div>
      <div className={styles.whyEndGlowLine} aria-hidden="true" />
    </section>
  );
}
