"use client";

export default function SalaryBreakdownPreview({
  components,
}) {
  const total = components.reduce(
    (sum, c) => sum + (c.monthly_amount ?? 0),
    0
  );

  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-medium text-sm">
        Monthly Breakdown
      </h4>

      {components.map((c) => (
        <div
          key={c.component_id}
          className="flex justify-between text-sm"
        >
          <span>{c.name}</span>
          <span>{c.monthly_amount}</span>
        </div>
      ))}

      <div className="border-t pt-2 flex justify-between font-medium">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}
