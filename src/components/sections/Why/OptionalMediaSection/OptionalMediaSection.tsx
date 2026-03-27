import styles from "./OptionalMediaSection.module.css";

export default function OptionalMediaSection() {
  return (
    <section className={styles.optionalMediaSection}>
      <div className={styles.mediaPlaceholder}>
        <p className={styles.mediaText}>Optional media section placeholder.</p>
      </div>
    </section>
  );
}
