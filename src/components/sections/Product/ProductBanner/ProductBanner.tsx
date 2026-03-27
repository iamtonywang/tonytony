import styles from "./ProductBanner.module.css";

export default function ProductBanner() {
  return (
    <section className={styles.bannerSection}>
      <h2 className={styles.heading}>Banner Area</h2>
      <div className={styles.bannerSlot}>
        <p className={styles.text}>Promotional banner slot will be expanded later.</p>
      </div>
    </section>
  );
}
