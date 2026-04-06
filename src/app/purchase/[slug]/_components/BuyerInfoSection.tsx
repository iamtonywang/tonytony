type Props = {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  onChange: (field: "buyerName" | "buyerPhone" | "buyerEmail", value: string) => void;
};

export default function BuyerInfoSection({ buyerName, buyerPhone, buyerEmail, onChange }: Props) {
  return (
    <section>
      <h2>Buyer Information</h2>
      <div>
        <label>
          Name
          <input value={buyerName} onChange={(e) => onChange("buyerName", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Phone
          <input value={buyerPhone} onChange={(e) => onChange("buyerPhone", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Email
          <input value={buyerEmail} onChange={(e) => onChange("buyerEmail", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

