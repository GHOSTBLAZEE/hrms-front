import { useAttendanceMonthlyReport } from "@/hooks/reports/useAttendanceMonthlyReport";

export default function AttendanceTab({ employee }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isLoading } =
    useAttendanceMonthlyReport({
      year,
      month,
      employee_id: employee.id,
    });

  if (isLoading) return <div>Loading attendance…</div>;

  return (
    <div className="text-sm">
      <div className="mb-2 font-medium">
        Attendance Summary ({month}/{year})
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Present" value={data?.present_days} />
        <Stat label="Absent" value={data?.absent_days} />
        <Stat label="Leave" value={data?.leave_days} />
        <Stat label="OT (hrs)" value={data?.overtime_hours} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold">{value ?? "—"}</div>
    </div>
  );
}
