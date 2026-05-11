import styles from "./HomeMotionDivider.module.css";

export default function HomeMotionDivider() {
  return (
    <section className={styles.dividerSection} aria-hidden="true">
      <div className={styles.motionLine} />
    </section>
  );
}
