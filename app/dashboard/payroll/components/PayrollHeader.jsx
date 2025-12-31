"use client";

import { Button } from "@/components/ui/button";
import PayrollStatusBadge from "./PayrollStatusBadge";

export default function PayrollHeader({
  run,
  onFinalize,
  onRevert,
  isLoading = false,
}) {
  const isDraft = run.status === "draft";
  const isFinalized = run.status === "finalized";

  // These flags should already come from backend
  const attendanceLocked = !!run.attendance_lock_id;

  const canFinalize =
    isDraft && attendanceLocked && !isLoading;

  const canRevert =
    isFinalized && !isLoading;

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            Payroll Status
          </h3>
          <PayrollStatusBadge status={run.status} />
        </div>

        {!attendanceLocked && isDraft && (
          <p className="text-xs text-muted-foreground">
            Attendance must be locked before
            finalizing payroll.
          </p>
        )}

        {isFinalized && (
          <p className="text-xs text-muted-foreground">
            This payroll has been finalized and
            is immutable.
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex gap-2">
        {/* Revert */}
        <Button
          size="sm"
          variant="outline"
          disabled={!canRevert}
          onClick={onRevert}
        >
          Revert
        </Button>

        {/* Finalize */}
        <Button
          size="sm"
          disabled={!canFinalize}
          onClick={onFinalize}
        >
          Finalize Payroll
        </Button>
      </div>
    </div>
  );
}
