"use client";

import { useEmployeeAttendanceMonthly } from "@/hooks/attendance/useEmployeeAttendanceMonthly";
import AttendanceTrend from "../[employeeId]/components/AttendanceTrend";

export default function AttendanceTab({ employee }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isLoading } = useEmployeeAttendanceMonthly({
    employeeId: employee.id,
    year,
    month,
  });



  if (isLoading) {
    return <div className="text-sm">Loading attendance…</div>;
  }

  return (
    <div className="text-sm space-y-3">
      <div className="font-medium">
        Attendance Summary ({month}/{year})
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Present" value={data?.present_days} />
        <Stat label="Absent" value={data?.absent_days} />
        <Stat label="Leave" value={data?.leave_days} />
        <Stat label="OT (hrs)" value={data?.overtime_hours} />
      </div>
      <AttendanceTrend employeeId={employee.id} />
    </div>
  );
}


function Stat({ label, value }) {
  const format = (val) => {
    if (val === null || val === undefined) return "—";

    const num = Number(val);

    // Integers stay clean, decimals (0.5, 1.25) are preserved
    return Number.isInteger(num) ? num : num.toString();
  };

  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold">
        {format(value)}
      </div>
    </div>
  );
}

