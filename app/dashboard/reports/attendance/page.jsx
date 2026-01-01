"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import { useAttendanceMonthlyReport } from "@/hooks/reports/useAttendanceMonthlyReport";
import AttendanceReportHeader from "./components/AttendanceReportHeader";
import AttendanceReportTable from "./components/AttendanceReportTable";
import { Button } from "@/components/ui/button";

export default function AttendanceMonthlyReportPage() {
  const { permissions } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const canView = hasPermission(permissions, ["view attendance reports"]);
  const canExport = hasPermission(permissions, ["export attendance reports"]);

  const { data, isLoading } = useAttendanceMonthlyReport(
    canView ? { year, month } : {}
  );

  if (!canView) {
    return <div className="p-6 text-sm">Unauthorized</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <AttendanceReportHeader
        year={year}
        month={month}
        onYearChange={setYear}
        onMonthChange={setMonth}
        meta={data?.meta}
        canExport={canExport}
      />

      <AttendanceReportTable
        data={data?.data ?? []}
        loading={isLoading}
      />
      <Button
        onClick={() => {
          window.location.href =
            `/api/v1/attendance/evidence/export?employee_id=${id}&from=2026-01-01&to=2026-01-31`;
        }}
      >
        Export Attendance Evidence
      </Button>

    </div>
  );
}
