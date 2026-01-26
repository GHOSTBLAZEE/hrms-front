export default function SlaEditor({ value, onChange }) {
  return (
    <div className="text-xs space-y-1">
      <label className="font-medium">SLA (days)</label>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 border rounded px-2 py-1"
      />
    </div>
  );
}
