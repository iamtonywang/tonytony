import styles from "./PurchasePageClient.module.css";

type Props = {
  zipcode: string;
  address1: string;
  address2: string;
  onChange: (field: "zipcode" | "address1" | "address2", value: string) => void;
};

export default function AddressSection({ zipcode, address1, address2, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Address</h2>
      <div className={styles.formRow}>
        <div className={styles.inlineFields}>
          <label className={styles.field}>
            Postal Code
            <input value={zipcode} onChange={(e) => onChange("zipcode", e.target.value)} />
          </label>
          <label className={styles.field}>
            Address
            <input value={address1} onChange={(e) => onChange("address1", e.target.value)} />
          </label>
        </div>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Detail
          <input value={address2} onChange={(e) => onChange("address2", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

