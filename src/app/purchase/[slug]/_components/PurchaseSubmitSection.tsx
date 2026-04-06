import styles from "./PurchasePageClient.module.css";

type Props = {
  isSubmitting: boolean;
  submitMessage: string | null;
  submitErrors: Record<string, string> | null;
  agreeToTerms: boolean;
  onAgreeChange: (value: boolean) => void;
  onSubmitClick: () => void;
};

export default function PurchaseSubmitSection({
  isSubmitting,
  submitMessage,
  submitErrors,
  agreeToTerms,
  onAgreeChange,
  onSubmitClick,
}: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Submit</h2>
      <div>
        <div className={styles.formRow}>
          <label className={`${styles.centeredText} ${styles.termsText}`}>
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

