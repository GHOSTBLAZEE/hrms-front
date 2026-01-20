"use client";

import { Button } from "@/components/ui/button";
import { useLeaveActions } from "@/hooks/useLeaves";


/* =========================================================
 | Pending Leave Approvals
 |========================================================= */
export default function PendingApprovals({ leaves = [] }) {
  const { approve } = useLeaveActions();

  if (!leaves.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No pending leave approvals.
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4 space-y-3">
      <h2 className="font-semibold">
        Pending Leave Approvals
      </h2>

      {leaves.map((leave) => (
        <div
          key={leave.id}
          className="flex items-center justify-between rounded border p-3"
        >
          {/* Left */}
          <div className="text-sm">
            <div className="font-medium">
              {leave.employee?.user?.name ??
                `Employee #${leave.employee_id}`}
            </div>

            <div className="text-xs text-muted-foreground">
              {leave.leave_type?.name} ·{" "}
              {leave.start_date} → {leave.end_date} ·{" "}
              {leave.days} day(s)
            </div>
          </div>

          {/* Right */}
          <Button
            size="sm"
            onClick={() => approve.mutate(leave.id)}
            disabled={approve.isLoading}
          >
            Approve
          </Button>
        </div>
      ))}
    </div>
  );
}
