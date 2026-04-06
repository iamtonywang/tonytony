import styles from "./PurchasePageClient.module.css";

export default function OrderNoticeSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Order Notice</h2>
      <p className={styles.submitNote}>Order terms and notices will be shown here.</p>
    </section>
  );
}

