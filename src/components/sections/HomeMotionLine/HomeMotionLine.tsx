import styles from "./HomeMotionLine.module.css";

export default function HomeMotionLine() {
  return (
    <section className={styles.section} aria-label="구분선">
      <div className={styles.motionLine} aria-hidden="true" />
    </section>
  );
}
