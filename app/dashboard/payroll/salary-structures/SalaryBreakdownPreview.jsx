"use client";

import { useWatch } from "react-hook-form";

export default function SalaryBreakdownPreview({
  basic = 0,
  hra = 0,
  allowances = 0,
}) {
  const gross =
    Number(basic || 0) +
    Number(hra || 0) +
    Number(allowances || 0);

  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-medium text-sm">
        Monthly Breakdown
      </h4>

      <Row label="Basic" value={basic} />
      <Row label="HRA" value={hra} />
      <Row label="Allowances" value={allowances} />

      <div className="border-t pt-2 flex justify-between font-medium">
        <span>Gross</span>
        <span>{gross}</span>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value || 0}</span>
    </div>
  );
}
