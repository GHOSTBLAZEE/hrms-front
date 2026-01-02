"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import { useAttendanceMonthlyReport } from "@/hooks/reports/useAttendanceMonthlyReport";

import AttendanceReportHeader from "./components/AttendanceReportHeader";
import AttendanceReportTable from "./components/AttendanceReportTable";
import { Button } from "@/components/ui/button";

export default function AttendanceMonthlyReportPage() {
  const { user, permissions } = useAuth();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  /* ---------------- Permissions ---------------- */
  const canView = hasPermission(permissions, ["view attendance reports"]);
  const canExport = hasPermission(permissions, ["view attendance reports"]);
console.log(canView,canExport);

  if (!canView) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You are not authorized to view attendance reports.
      </div>
    );
  }

  /* ---------------- Data ---------------- */
  const { data, isLoading } = useAttendanceMonthlyReport({
    year,
    month,
  });

  /* ---------------- Export ---------------- */
  const handleExport = () => {
    if (!user?.employee?.id) return;

    const from = format(
      startOfMonth(new Date(year, month - 1)),
      "yyyy-MM-dd"
    );
    const to = format(
      endOfMonth(new Date(year, month - 1)),
      "yyyy-MM-dd"
    );

    window.location.href =
      `/api/v1/attendance/evidence/export` +
      `?employee_id=${user.employee.id}` +
      `&from=${from}` +
      `&to=${to}`;
  };

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

      {canExport && (
        <Button onClick={handleExport}>
          Export Attendance Evidence
        </Button>
      )}
    </div>
  );
}
