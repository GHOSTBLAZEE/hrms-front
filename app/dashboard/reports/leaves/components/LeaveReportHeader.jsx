import { exportLeaveReportApi } from "@/lib/api/reports/leaveReportApi";
import { toast } from "sonner";

export default function LeaveReportHeader({ canExport }) {
  const handleExport = async () => {
    try {
      const blob = await exportLeaveReportApi();

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv" })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = "leave-report.csv";
      a.click();

      window.URL.revokeObjectURL(url);
      toast.success("Leave report exported");
    } catch {
      toast.error("Failed to export leave report");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Leave Reports</h1>
        <p className="text-sm text-muted-foreground">
          Read-only leave usage summary
        </p>
      </div>

      {canExport && (
        <button
          onClick={handleExport}
          className="border rounded px-3 py-1 text-sm"
        >
          Export CSV
        </button>
      )}
    </div>
  );
}
