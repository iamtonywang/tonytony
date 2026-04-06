import styles from "./PurchasePageClient.module.css";

type Props = {
  paymentMethod: string;
  onChange: (field: "paymentMethod", value: string) => void;
};

export default function PaymentMethodSection({ paymentMethod, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Payment Method</h2>
      <div className={styles.formRow}>
        <div className={styles.paymentWrap}>
          <button
            type="button"
            className={`${styles.paymentItem} ${paymentMethod === "card" ? styles.active : ""}`}
            onClick={() => onChange("paymentMethod", "card")}
          >
            Card
          </button>

          <button
            type="button"
            className={`${styles.paymentItem} ${paymentMethod === "cash" ? styles.active : ""}`}
            onClick={() => onChange("paymentMethod", "cash")}
          >
            Cash
          </button>
        </div>
      </div>
    </section>
  );
}

