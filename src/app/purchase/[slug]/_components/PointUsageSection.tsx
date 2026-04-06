type Props = {
  pointUsedAmount: number;
  onChange: (field: "pointUsedAmount", value: number) => void;
};

export default function PointUsageSection({ pointUsedAmount, onChange }: Props) {
  return (
    <section>
      <h2>Point Usage</h2>
      <div>
        <label>
          Use Points
          <input
            type="number"
            value={pointUsedAmount}
            onChange={(e) => onChange("pointUsedAmount", Number(e.target.value || 0))}
          />
        </label>
      </div>
      {/* Note: No validation or balance checks here (intentionally omitted). */}
    </section>
  );
}

