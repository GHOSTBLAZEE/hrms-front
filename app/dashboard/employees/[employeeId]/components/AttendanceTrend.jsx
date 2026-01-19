"use client";

import { useEmployeeAttendanceTrend } from "@/hooks/attendance/useEmployeeAttendanceTrend";
import AttendanceTrendSparkline from "./AttendanceTrendSparkline";

export default function AttendanceTrend({ employeeId }) {
  const { data = [], isLoading } =
    useEmployeeAttendanceTrend(employeeId);

  if (isLoading) {
    return <div className="text-sm">Loading trend…</div>;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">
          Last 3 Months Attendance
        </div>
        <span className="text-xs text-muted-foreground">
          Present / Payable
        </span>
      </div>

      {/* Sparkline */}
      <AttendanceTrendSparkline data={data} />

      {/* Month labels + performance flag */}
      <div className="flex justify-between text-xs">
        {data.map((m, index) => {
          const dropped = hasPerformanceDrop(data, index);

          return (
            <span
              key={`${m.year}-${m.month}`}
              className={
                dropped
                  ? "text-red-600 font-medium"
                  : "text-muted-foreground"
              }
            >
              {m.label}
              {dropped && <DropIndicator />}
            </span>
          );
        })}
      </div>

    </div>
  );
}

/* ------------------------------------------------------------
 | Performance drop logic
 |------------------------------------------------------------ */
function hasPerformanceDrop(data, index) {
  if (index === 0) return false;

  const prev = Number(data[index - 1].present_days);
  const curr = Number(data[index].present_days);

  if (!prev) return false;

  return (prev - curr) / prev >= 0.2;
}
function DropIndicator() {
  return (
    <span className="relative group inline-flex items-center ml-1 cursor-help">
      ↓
      <span
        className="
          absolute bottom-full mb-1 hidden group-hover:block
          whitespace-nowrap rounded bg-black px-2 py-1
          text-xs text-white shadow
        "
      >
        Present days dropped ≥20% from previous month.
      </span>
    </span>
  );
}