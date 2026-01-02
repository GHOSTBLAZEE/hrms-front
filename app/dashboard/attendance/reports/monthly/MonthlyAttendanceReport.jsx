"use client";

import { useState } from "react";
import { startOfMonth } from "date-fns";

import { useAttendanceMonth } from "@/hooks/attendance/useAttendanceMonth";
import { useAttendanceLock } from "@/hooks/attendance/useAttendanceLock";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

import ReportHeader from "./components/ReportHeader";
import MonthlySummaryBar from "./components/MonthlySummaryBar";
import MonthlyAttendanceTable from "./components/MonthlyAttendanceTable";
import EmptyState from "./components/EmptyState";

import { PERMISSIONS } from "./constants";

export default function MonthlyAttendanceReport() {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  const { permissions = [] } = useAuth();

  const year = month.getFullYear();
  const monthNumber = month.getMonth() + 1;

  const { data, isLoading, isError } = useAttendanceMonth({
    year,
    month: monthNumber,
  });

  const { data: lockInfo } = useAttendanceLock(month);

  const canView = hasPermission(
    permissions,
    PERMISSIONS.VIEW_ATTENDANCE_REPORT
  );

  const canExport = hasPermission(
    permissions,
    PERMISSIONS.EXPORT_ATTENDANCE_REPORT
  );

  // --- PERMISSION GUARD ---
  if (!canView) {
    return (
      <div className="p-10 text-center text-red-500">
        You are not authorized to view attendance reports.
      </div>
    );
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return <div className="p-10 text-center">Loading attendance…</div>;
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load attendance data.
      </div>
    );
  }

  // --- NO DATA STATE ---
  if (!data?.data?.length) {
    return <EmptyState />;
  }

  // --- DATA ---
  const rows = data.data;
  const meta = data.meta;
console.log(data);

  return (
    <div className="space-y-6 p-6">
      <ReportHeader
        month={month}
        onMonthChange={setMonth}
        attendance={rows}
        locked={meta.locked}
        lockReason={meta.locked_at}
        canExport={canExport}
        canChangeMonth={canExport}
      />

      <MonthlySummaryBar attendance={rows} />

      <MonthlyAttendanceTable attendance={rows} />
    </div>
  );
}
