import * as XLSX from "xlsx";
import { format } from "date-fns";
import { logAuditEvent } from "@/lib/api/auditApi";

export async function exportAttendanceExcel(
  attendance,
  month,
  { locked, payrollRunId }
) {
  if (!attendance?.length) return;

  // 1. Transform data into payroll-friendly rows
  const rows = attendance.map((a) => ({
    Date: format(new Date(a.date), "yyyy-MM-dd"),
    Status: a.status,
    "First Check In": a.first_check_in || "",
    "Last Check Out": a.last_check_out || "",
    "Total Work Hours": Number(a.total_work_hours || 0),
    "Overtime Hours": Number(a.overtime_hours || 0),
  }));

  // 2. Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 3. Auto column width
  worksheet["!cols"] = [
    { wch: 12 }, // Date
    { wch: 12 }, // Status
    { wch: 18 }, // First In
    { wch: 18 }, // Last Out
    { wch: 20 }, // Total Hours
    { wch: 20 }, // OT
  ];

  // 4. Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // 1. Audit first
  await logAuditEvent("attendance.monthly.export", {
    month: format(month, "yyyy-MM"),
    format: "excel",
    locked,
  });

  // 2. Then export file
  XLSX.writeFile(workbook, `attendance-${format(month, "yyyy-MM")}.xlsx`);
}
