"use client";

export default function MonthlySummaryBar({ attendance }) {
  const summary = attendance.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      acc.hours += Number(a.total_work_hours || 0);
      return acc;
    },
    { hours: 0 }
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat label="Present" value={summary.present || 0} />
      <Stat label="Absent" value={summary.absent || 0} />
      <Stat label="Leave" value={summary.leave || 0} />
      <Stat label="Holiday" value={summary.holiday || 0} />
      <Stat label="Total Hours" value={`${summary.hours}h`} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
