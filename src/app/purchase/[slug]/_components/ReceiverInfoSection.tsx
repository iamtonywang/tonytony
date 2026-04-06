import styles from "./PurchasePageClient.module.css";

type Props = {
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  onChange: (field: "receiverName" | "receiverPhone" | "receiverEmail", value: string) => void;
};

export default function ReceiverInfoSection({ receiverName, receiverPhone, receiverEmail, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Receiver Information</h2>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Name
          <input value={receiverName} onChange={(e) => onChange("receiverName", e.target.value)} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Phone
          <input value={receiverPhone} onChange={(e) => onChange("receiverPhone", e.target.value)} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Email
          <input value={receiverEmail} onChange={(e) => onChange("receiverEmail", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

