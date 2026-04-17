"use client";

import styles from "./PurchasePageClient.module.css";

type Props = {
  pointUsedAmount: number;
  onChange: (field: "pointUsedAmount", value: number) => void;
};

export default function PointUsageSection({ pointUsedAmount, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Point Usage</h2>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Use Points
          <input
            type="number"
            value={pointUsedAmount}
            onChange={(e) => onChange("pointUsedAmount", Number(e.target.value || 0))}
          />
        </label>
      </div>
      <p className={styles.submitNote}>Point validation and balance checks are not applied yet.</p>
    </section>
  );
}

