import PayrollStatusBadge from "../components/PayrollStatusBadge";
import { format } from "date-fns";

export default function PayrollRunSummary({ run }) {
  return (
    <div className="border rounded-md p-4 flex justify-between">
      <div>
        <h2 className="text-lg font-semibold">
          {format(
            new Date(run.year, run.month - 1),
            "MMMM yyyy"
          )}
        </h2>

        <p className="text-sm text-muted-foreground">
          Attendance locked • Salary snapshotted
        </p>
      </div>

      <div className="text-right space-y-1">
        <PayrollStatusBadge status={run.status} />
        <div className="text-xs text-muted-foreground">
          Run at: {run.run_at || "—"}
        </div>
      </div>
    </div>
  );
}
