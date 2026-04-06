import styles from "./PurchasePageClient.module.css";

type Props = {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  onChange: (field: "buyerName" | "buyerPhone" | "buyerEmail", value: string) => void;
};

export default function BuyerInfoSection({ buyerName, buyerPhone, buyerEmail, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Buyer Information</h2>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Name
          <input value={buyerName} onChange={(e) => onChange("buyerName", e.target.value)} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Phone
          <input value={buyerPhone} onChange={(e) => onChange("buyerPhone", e.target.value)} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Email
          <input value={buyerEmail} onChange={(e) => onChange("buyerEmail", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

