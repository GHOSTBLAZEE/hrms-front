import PayrollStatusBadge from "../components/PayrollStatusBadge";
import { format } from "date-fns";

export default function PayrollRunSummary({ run }) {
  const runMonth = format(
    new Date(run.year, run.month - 1),
    "MMMM yyyy"
  );

  const runAt = run.run_at
    ? format(new Date(run.run_at), "dd MMM yyyy, hh:mm a")
    : "—";

  return (
    <div className="rounded-md border bg-muted/20 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          Payroll — {runMonth}
        </h2>

        <div className="text-sm text-muted-foreground">
          Attendance locked • Salary structure snapshotted
        </div>

        {run.status === "finalized" && (
          <div className="text-xs text-muted-foreground">
            This payroll is finalized and cannot be edited
          </div>
        )}
      </div>

      {/* Right */}
      <div className="text-right space-y-1">
        <PayrollStatusBadge status={run.status} />

        <div className="text-xs text-muted-foreground">
          Run at: {runAt}
        </div>

        {run.run_by && (
          <div className="text-xs text-muted-foreground">
            Run by: {run.run_by?.name ?? "—"}
          </div>
        )}
      </div>
    </div>
  );
}
