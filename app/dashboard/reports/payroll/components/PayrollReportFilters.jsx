"use client";

import { Input } from "@/components/ui/input";

export default function PayrollReportFilters({
  filters,
  onChange,
}) {
  return (
    <div className="flex gap-3 items-center">
      <Input
        type="number"
        min="2000"
        value={filters.year}
        onChange={(e) =>
          onChange({ ...filters, year: e.target.value })
        }
        className="w-24"
      />

      <Input
        type="number"
        min="1"
        max="12"
        value={filters.month}
        onChange={(e) =>
          onChange({ ...filters, month: e.target.value })
        }
        className="w-20"
      />
    </div>
  );
}
