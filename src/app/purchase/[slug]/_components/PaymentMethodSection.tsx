type Props = {
  paymentMethod: string;
  onChange: (field: "paymentMethod", value: string) => void;
};

export default function PaymentMethodSection({ paymentMethod, onChange }: Props) {
  return (
    <section>
      <h2>Payment Method</h2>
      <div>
        <label>
          Method
          <input value={paymentMethod} onChange={(e) => onChange("paymentMethod", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

