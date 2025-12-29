import { exportAttendanceMonthlyReportApi } from "@/lib/api/reports/attendanceReportApi";
import { exportAttendanceMonthlyReportPdfApi } from "@/lib/api/reports/attendanceReportApi";

export default function AttendanceReportHeader({
  year,
  month,
  onYearChange,
  onMonthChange,
  meta,
  canExport,
}) {
  const isLocked = meta?.locked === true;

  const handleCsvExport = async () => {
    await exportAttendanceMonthlyReportApi({ year, month });
  };

  const handlePdfExport = async () => {
    await exportAttendanceMonthlyReportPdfApi({ year, month });
  };

  return (
    <div className="flex justify-between">
      <h1>Attendance Monthly Report</h1>

      {canExport && (
        <>
          <button disabled={!isLocked} onClick={handleCsvExport}>
            Export CSV
          </button>
          <button disabled={!isLocked} onClick={handlePdfExport}>
            Export PDF
          </button>
        </>
      )}
    </div>
  );
}
