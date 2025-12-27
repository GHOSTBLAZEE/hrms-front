"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAttendanceMonthlyReport } from "@/hooks/reports/useAttendanceMonthlyReport";
import { DataTable } from "@/components/data-table/DataTable";
import { hasPermission } from "@/lib/permissions";

export default function AttendanceMonthlyReportPage() {
  // ✅ ALL HOOKS FIRST
  const { permissions } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const canView = hasPermission(permissions, ["view attendance reports"]);

  const { data = [], isLoading } = useAttendanceMonthlyReport(
    canView ? { year, month } : {}
  );

  // ✅ CONDITIONAL RETURN AFTER HOOKS
  if (!canView) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You are not authorized to view attendance reports.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Attendance Monthly Report</h1>

      <DataTable
        loading={isLoading}
        data={data}
        columns={
          [
            /* columns unchanged */
          ]
        }
      />
    </div>
  );
}
