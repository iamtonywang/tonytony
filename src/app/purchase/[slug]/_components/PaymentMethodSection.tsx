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
        <label className={styles.centeredText}>
          Method
          <input value={paymentMethod} onChange={(e) => onChange("paymentMethod", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

