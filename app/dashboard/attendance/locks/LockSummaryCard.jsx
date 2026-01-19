"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LockSummaryCard({ summary = {} }) {
  const format = (value) => {
    if (value === null || value === undefined) return "—";

    const num = Number(value);

    // Show .5 if applicable, otherwise integer
    return Number.isInteger(num) ? num : num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div>Total Employees</div>
        <div>{format(summary.total_employees)}</div>

        <div>Present Days</div>
        <div>{format(summary.present_days)}</div>

        <div>Absent Days</div>
        <div>{format(summary.absent_days)}</div>

        <div>Approved Corrections</div>
        <div>{format(summary.approved_corrections)}</div>

        <div>Pending Corrections</div>
        <div className="text-red-600">
          {format(summary.pending_corrections)}
        </div>
      </CardContent>
    </Card>
  );
}
