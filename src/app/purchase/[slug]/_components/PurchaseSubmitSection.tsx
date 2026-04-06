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
    <section>
      <h2>Submit</h2>
      <div>
        <div>
          <label>
            Quantity
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => onQuantityChange(Number(e.target.value || 1))}
            />
          </label>
        </div>
        <div>
          <label>
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
        {submitMessage ? <p>{submitMessage}</p> : null}
        {submitErrors
          ? (
            <div>
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

