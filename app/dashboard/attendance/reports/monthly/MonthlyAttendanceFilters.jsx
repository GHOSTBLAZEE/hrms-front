"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MonthlyAttendanceFilters({
  month,
  setMonth,
  onApply,
}) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="text-xs font-medium">Month</label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <Button onClick={onApply}>Apply</Button>
    </div>
  );
}
