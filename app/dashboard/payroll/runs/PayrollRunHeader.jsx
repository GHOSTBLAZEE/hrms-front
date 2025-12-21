"use client";

import { Input } from "@/components/ui/input";
import PayrollRunStatusBadge from "./PayrollRunStatusBadge";

export default function PayrollRunHeader({
  month,
  setMonth,
  status,
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Payroll Run
        </h1>
        <p className="text-sm text-muted-foreground">
          Attendance snapshot for salary processing
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <PayrollRunStatusBadge status={status} />
      </div>
    </div>
  );
}
