"use client";

import { useState } from "react";
import { startOfMonth } from "date-fns";

import { useAttendanceMonth } from "@/hooks/attendance/useAttendanceMonth";
import ReportHeader from "./components/ReportHeader";
import MonthlyCalendar from "./components/MonthlyCalendar";
import MonthlySummaryBar from "./components/MonthlySummaryBar";
import MonthlyAttendanceTable from "./components/MonthlyAttendanceTable";
import DayDetailModal from "./components/DayDetailModal";
import EmptyState from "./components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "./constants";

export default function MonthlyAttendanceReport() {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(null);

  const { data = [], isLoading } = useAttendanceMonth(month);
  const { data: lockInfo } = useAttendanceLock(month);
  const { hasPermission } = useAuth();

  const canView = hasPermission(PERMISSIONS.VIEW_ATTENDANCE_REPORT);
  const canExport = hasPermission(PERMISSIONS.EXPORT_ATTENDANCE_REPORT);
  const canChangeMonth = canExport; // HR/Admin only
  const isLocked = lockInfo?.locked === true;
  const lockReason = lockInfo?.reason;
  if (!isLoading && data.length === 0) {
    return <EmptyState />;
  }
  if (!canView) {
    return (
      <div className="p-10 text-center text-red-500">
        You are not authorized to view attendance reports.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ReportHeader
        month={month}
        onMonthChange={setMonth}
        attendance={data}
        locked={isLocked}
        lockReason={lockReason}
        canExport={canExport}
        canChangeMonth={canChangeMonth}
      />

      <MonthlySummaryBar attendance={data} />

      <MonthlyCalendar
        month={month}
        attendance={data}
        onDayClick={setSelected}
      />

      <MonthlyAttendanceTable attendance={data} />

      <DayDetailModal
        open={!!selected}
        onOpenChange={() => setSelected(null)}
        day={selected?.day}
        attendance={selected?.attendance}
      />
    </div>
  );
}
