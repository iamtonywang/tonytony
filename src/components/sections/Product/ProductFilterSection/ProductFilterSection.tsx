import styles from "./ProductFilterSection.module.css";

export default function ProductFilterSection() {
  return (
    <section className={styles.filterSection}>
      <h2 className={styles.heading}>Filter Area</h2>
      <div className={styles.filterSlot}>
        <p className={styles.text}>Filter controls will be added in a later step.</p>
      </div>
    </section>
  );
}
