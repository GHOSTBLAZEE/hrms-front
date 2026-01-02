"use client";

export default function MonthlySummaryBar({ attendance = [] }) {
  const totals = attendance.reduce(
    (acc, a) => {
      acc.present += Number(a.present_days ?? 0);
      acc.absent += Number(a.absent_days ?? 0);
      acc.leave += Number(a.leave_days ?? 0);
      acc.half += Number(a.half_days ?? 0);
      acc.late += Number(a.late_count ?? 0);
      return acc;
    },
    { present: 0, absent: 0, leave: 0, half: 0, late: 0 }
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat label="Present Days" value={totals.present} />
      <Stat label="Absent Days" value={totals.absent} />
      <Stat label="Leave Days" value={totals.leave} />
      <Stat label="Half Days" value={totals.half} />
      <Stat label="Late Marks" value={totals.late} />
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
