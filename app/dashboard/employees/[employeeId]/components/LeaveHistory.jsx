"use client";

import { format } from "date-fns";
import { useEmployeeLeaves } from "../hooks/useEmployeeLeaves";

/* =========================================================
 | Leave History (READ-ONLY)
 |========================================================= */
export default function LeaveHistory({ employeeId }) {
  const { data, isLoading } = useEmployeeLeaves(employeeId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading leave history…
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave records found.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      {data.map((leave) => {
        const isApproved = leave.status === "approved";
        const isUnpaid = leave.is_paid === false;

        return (
          <div
            key={leave.id}
            className="rounded-md border p-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="font-medium">
                {leave.leave_type?.name ?? "Leave"}
              </div>

              <StatusBadge status={leave.status} />
            </div>

            {/* Period */}
            <div className="mt-1 text-muted-foreground">
              {safeDate(leave.start_date)} →{" "}
              {safeDate(leave.end_date)} ·{" "}
              <strong>{leave.days}</strong> day(s)
            </div>

            {/* Paid / Unpaid */}
            <div className="mt-1">
              {isUnpaid ? (
                <span className="text-red-600 text-xs">
                  Unpaid leave (LOP)
                </span>
              ) : (
                <span className="text-green-600 text-xs">
                  Paid leave
                </span>
              )}
            </div>

            {/* Salary impact hint */}
            {isApproved && isUnpaid && (
              <div className="mt-1 text-xs text-orange-600">
                Salary deduction applied in payroll
              </div>
            )}

            {/* Reason */}
            {leave.reason && (
              <div className="mt-2 text-xs text-muted-foreground">
                Reason: {leave.reason}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
 | Helpers
 |========================================================= */
function StatusBadge({ status }) {
  const color =
    status === "approved"
      ? "text-green-600"
      : status === "rejected"
      ? "text-red-600"
      : status === "cancelled"
      ? "text-gray-500"
      : "text-yellow-600";

  return (
    <span className={`text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}

function safeDate(value) {
  try {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return format(d, "dd MMM yyyy");
    }
  } catch {}
  return value ?? "—";
}
