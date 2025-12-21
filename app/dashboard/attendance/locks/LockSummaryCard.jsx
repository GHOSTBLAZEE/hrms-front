"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LockSummaryCard({ summary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div>Total Employees</div>
        <div>{summary.total_employees}</div>

        <div>Present Days</div>
        <div>{summary.present_days}</div>

        <div>Absent Days</div>
        <div>{summary.absent_days}</div>

        <div>Approved Corrections</div>
        <div>{summary.approved_corrections}</div>

        <div>Pending Corrections</div>
        <div className="text-red-600">
          {summary.pending_corrections}
        </div>
      </CardContent>
    </Card>
  );
}
