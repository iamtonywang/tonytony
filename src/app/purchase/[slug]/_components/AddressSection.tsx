type Props = {
  zipcode: string;
  address1: string;
  address2: string;
  onChange: (field: "zipcode" | "address1" | "address2", value: string) => void;
};

export default function AddressSection({ zipcode, address1, address2, onChange }: Props) {
  return (
    <section>
      <h2>Address</h2>
      <div>
        <label>
          Zipcode
          <input value={zipcode} onChange={(e) => onChange("zipcode", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Address 1
          <input value={address1} onChange={(e) => onChange("address1", e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Address 2
          <input value={address2} onChange={(e) => onChange("address2", e.target.value)} />
        </label>
      </div>
    </section>
  );
}

