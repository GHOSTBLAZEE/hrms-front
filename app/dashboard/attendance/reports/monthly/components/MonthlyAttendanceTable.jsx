"use client";

export default function MonthlyAttendanceTable({ attendance = [] }) {
  return (
    <div className="border rounded overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Present</th>
            <th className="p-2 text-left">Absent</th>
            <th className="p-2 text-left">Leave</th>
            <th className="p-2 text-left">Half Days</th>
            <th className="p-2 text-left">Late Marks</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((a, idx) => (
            <tr
              key={a.employee_id ?? idx}   // ⭐ key fixed
              className="border-t"
            >
              <td className="p-2">
                {a.employee_name ?? "—"}
              </td>

              <td className="p-2">{a.present_days ?? 0}</td>
              <td className="p-2">{a.absent_days ?? 0}</td>
              <td className="p-2">{a.leave_days ?? 0}</td>
              <td className="p-2">{a.half_days ?? 0}</td>
              <td className="p-2">{a.late_count ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
