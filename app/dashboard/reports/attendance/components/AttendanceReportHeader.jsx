import { Download } from "lucide-react";
import { exportAttendanceMonthlyReportApi } from "@/lib/api/reports/attendanceReportApi";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { exportAttendanceMonthlyReportPdfApi } from "@/lib/api/reports/attendanceReportApi";

export default function AttendanceReportHeader({
  year,
  month,
  onYearChange,
  onMonthChange,
}) {
  const handleCsvExport = async () => {
    try {
      const blob = await exportAttendanceMonthlyReportApi({ year, month });

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv" })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${year}-${month}.csv`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Attendance report exported");
    } catch (err) {
      toast.error("Failed to export attendance report");
    }
  };
const handlePdfExport = async () => {
  const blob = await exportAttendanceMonthlyReportPdfApi({ year, month });

  const url = window.URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" })
  );
const isLocked = meta?.locked === true;

  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-report-${year}-${month}.pdf`;
  a.click();

  window.URL.revokeObjectURL(url);
};
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">
        Attendance Monthly Report
      </h1>

      <div className="flex gap-2 items-center">
        {/* Month */}
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Export */}
        {canExport && (
  <>
    <button
      onClick={handleCsvExport}
      disabled={!isLocked}
      className={`flex items-center gap-2 border rounded px-3 py-1 text-sm
        ${!isLocked ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title={
        !isLocked
          ? "Attendance must be locked for payroll before export"
          : "Export CSV"
      }
    >
      Export CSV
    </button>

    <button
      onClick={handlePdfExport}
      disabled={!isLocked}
      className={`flex items-center gap-2 border rounded px-3 py-1 text-sm
        ${!isLocked ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title={
        !isLocked
          ? "Attendance must be locked for payroll before export"
          : "Export PDF"
      }
    >
      Export PDF
    </button>
  </>
)}


      </div>
    </div>
  );
}
