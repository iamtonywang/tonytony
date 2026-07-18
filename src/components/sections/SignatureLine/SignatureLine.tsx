import styles from "./SignatureLine.module.css";

export default function SignatureLine() {
  return (
    <div className={styles.signatureLine}>
      <span className={`${styles.line} ${styles.lineLeft}`} aria-hidden="true" />
      <span className={styles.brand}>TONYWANG</span>
      <span className={`${styles.line} ${styles.lineRight}`} aria-hidden="true" />
    </div>
  );
}
