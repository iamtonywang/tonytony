type Props = {
  quantity: number;
  agreeToTerms: boolean;
  onQuantityChange: (value: number) => void;
  onAgreeChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function PurchaseSubmitSection({
  quantity,
  agreeToTerms,
  onQuantityChange,
  onAgreeChange,
  onSubmit,
}: Props) {
  return (
    <section>
      <h2>Submit</h2>
      <form onSubmit={onSubmit}>
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
        <button type="submit">Place Order (Disabled)</button>
      </form>
    </section>
  );
}

