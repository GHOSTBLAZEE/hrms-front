import { format } from "date-fns";

export function exportAttendanceCsv(attendance, month) {
  if (!attendance?.length) return;

  const headers = [
    "Date",
    "Status",
    "First Check In",
    "Last Check Out",
    "Total Work Hours",
    "Overtime Hours",
  ];

  const rows = attendance.map((a) => [
    format(new Date(a.date), "yyyy-MM-dd"),
    a.status,
    a.first_check_in || "",
    a.last_check_out || "",
    a.total_work_hours ?? 0,
    a.overtime_hours ?? 0,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-${format(month, "yyyy-MM")}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
