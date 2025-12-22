"use client";

import { format } from "date-fns";

export default function MonthlyAttendanceTable({ attendance }) {
  return (
    <div className="border rounded overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th>Status</th>
            <th>In</th>
            <th>Out</th>
            <th>Hours</th>
            <th>OT</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">
                {format(new Date(a.date), "dd MMM yyyy")}
              </td>
              <td>{a.status}</td>
              <td>{a.first_check_in || "-"}</td>
              <td>{a.last_check_out || "-"}</td>
              <td>{a.total_work_hours || 0}</td>
              <td>{a.overtime_hours || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
