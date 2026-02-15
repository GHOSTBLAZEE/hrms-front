"use client";

import { useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import { useAttendanceMonthlyReport } from "@/hooks/reports/useAttendanceMonthlyReport";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

import AttendanceReportHeader from "./components/AttendanceReportHeader";
import AttendanceReportTable from "./components/AttendanceReportTable";
import { Button } from "@/components/ui/button";

export default function AttendanceMonthlyReportPage() {
  const { user, permissions } = useAuth();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [exporting, setExporting] = useState(false);

  /* ---------------- Permissions ---------------- */
  const canView   = hasPermission(permissions, ["view attendance reports"]);
  // FIX: canExport uses its own dedicated permission string
  const canExport = hasPermission(permissions, ["export attendance reports"]);

  if (!canView) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You are not authorized to view attendance reports.
      </div>
    );
  }

  /* ---------------- Data ---------------- */
  const { data, isLoading } = useAttendanceMonthlyReport({ year, month });

  /* ---------------- Export ---------------- */
  // FIX: Use apiClient (carries session cookies + XSRF token) instead of
  // window.location.href which strips auth headers on cross-origin requests.
  const handleExport = async () => {
    if (!user?.employee?.id) return;

    const from = format(startOfMonth(new Date(year, month - 1)), "yyyy-MM-dd");
    const to   = format(endOfMonth(new Date(year, month - 1)),   "yyyy-MM-dd");

    setExporting(true);
    try {
      const res = await apiClient.get("/api/v1/attendance/evidence/export", {
        params: { employee_id: user.employee.id, from, to },
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-evidence-${year}-${String(month).padStart(2, "0")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to export attendance evidence.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <AttendanceReportHeader
        year={year}
        month={month}
        onYearChange={setYear}
        onMonthChange={setMonth}
        meta={data?.meta}
        canExport={canExport}
      />

      <AttendanceReportTable data={data?.data ?? []} loading={isLoading} />

      {canExport && (
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export Attendance Evidence"}
        </Button>
      )}
    </div>
  );
}