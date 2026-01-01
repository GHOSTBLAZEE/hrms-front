"use client";

import { addMonths, subMonths, format } from "date-fns";

import LockBadge from "./LockBadge";
import { exportAttendanceCsv } from "../utils/exportAttendanceCsv";
import { exportAttendanceExcel } from "../utils/exportAttendanceExcel";
import { Button } from "@/components/ui/button";

export default function ReportHeader({
  month,
  onMonthChange,
  attendance,
  locked,
  lockReason,
  canExport,
  canChangeMonth,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Attendance Monthly Report</h1>
        <p className="text-sm text-muted-foreground">
          {format(month, "MMMM yyyy")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <LockBadge locked={locked} reason={lockReason} />
        <Button
          size="sm"
          variant="outline"
          onClick={() => exportAttendanceCsv(attendance, month)}
        >
          Export CSV
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={!canExport || locked}
          onClick={() =>
            exportAttendanceExcel(attendance, month, {
              locked,
              payrollRunId: lockInfo?.payroll_run_id,
            })
          }
        >
          Export Excel
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!canChangeMonth}
          onClick={() => onMonthChange(subMonths(month, 1))}
        >
          Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canChangeMonth}
          onClick={() => onMonthChange(addMonths(month, 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
