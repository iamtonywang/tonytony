type Props = {
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  onChange: (field: "receiverName" | "receiverPhone" | "receiverEmail", value: string) => void;
};

export default function ReceiverInfoSection({ receiverName, receiverPhone, receiverEmail, onChange }: Props) {
  return (
    <section>
      <h2>Receiver Information</h2>
      <div>
        <label>
          Name
          <input value={receiverName} onChange={(e) => onChange("receiverName", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Phone
          <input value={receiverPhone} onChange={(e) => onChange("receiverPhone", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Email
          <input value={receiverEmail} onChange={(e) => onChange("receiverEmail", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

