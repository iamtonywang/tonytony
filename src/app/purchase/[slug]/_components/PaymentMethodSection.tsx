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
        <div className={styles.methodRow}>
          <label className={styles.methodOption}>
            <input
              type="radio"
              name="payment_method"
              checked={paymentMethod === "card"}
              onChange={() => onChange("paymentMethod", "card")}
            />
            Card
          </label>
          <label className={styles.methodOption}>
            <input
              type="radio"
              name="payment_method"
              checked={paymentMethod === "cash"}
              onChange={() => onChange("paymentMethod", "cash")}
            />
            Cash
          </label>
        </div>
      </div>
    </section>
  );
}

