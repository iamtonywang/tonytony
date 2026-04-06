import styles from "./PurchasePageClient.module.css";

type Props = {
  isSubmitting: boolean;
  submitMessage: string | null;
  submitErrors: Record<string, string> | null;
  quantity: number;
  agreeToTerms: boolean;
  onQuantityChange: (value: number) => void;
  onAgreeChange: (value: boolean) => void;
  onSubmitClick: () => void;
};

export default function PurchaseSubmitSection({
  isSubmitting,
  submitMessage,
  submitErrors,
  quantity,
  agreeToTerms,
  onQuantityChange,
  onAgreeChange,
  onSubmitClick,
}: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Submit</h2>
      <div>
        <div className={styles.formRow}>
          <label className={styles.centeredText}>
            Quantity
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => onQuantityChange(Number(e.target.value || 1))}
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={styles.centeredText}>
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => onAgreeChange(e.target.checked)}
            />
            I agree to the terms
          </label>
        </div>
        <button type="button" onClick={onSubmitClick} disabled={isSubmitting}>
          {isSubmitting ? "검증 중..." : "주문 검증"}
        </button>
        {submitMessage ? <p className={styles.submitNote}>{submitMessage}</p> : null}
        {submitErrors
          ? (
            <div className={styles.submitNote}>
              {Object.entries(submitErrors).map(([field, msg]) => (
                <p key={field}>{`${field}: ${msg}`}</p>
              ))}
            </div>
          )
          : null}
      </div>
    </section>
  );
}

