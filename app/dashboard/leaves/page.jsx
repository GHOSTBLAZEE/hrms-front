"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ApplyLeaveDialog from "./components/ApplyLeaveDialog";

import { useAuth } from "@/hooks/useAuth";
import { useEmployeeLeaves } from "../employees/[employeeId]/hooks/useEmployeeLeaves";
import { useLeaveActions } from "@/hooks/useLeaves";


/* =========================================================
 | My Leaves Page (Employee)
 |========================================================= */
export default function LeavesPage() {
  const { user } = useAuth();
  const employeeId = user?.employee_id;

  const { data, isLoading } = useEmployeeLeaves(employeeId);
  const { cancel } = useLeaveActions();

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading leaves…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Leaves</h1>

        <Button onClick={() => setOpen(true)}>
          Apply Leave
        </Button>
      </div>

      {/* Apply dialog */}
      <ApplyLeaveDialog
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Leave list */}
      {!data?.length && (
        <div className="text-sm text-muted-foreground">
          No leave records found.
        </div>
      )}

      {data?.map((leave) => (
        <div
          key={leave.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          {/* Left */}
          <div>
            <p className="font-medium">
              {leave.leave_type?.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {leave.start_date} → {leave.end_date} (
              {leave.days} days)
            </p>

            <p className="text-sm capitalize">
              Status: {leave.status}
            </p>

            {leave.is_paid === false && (
              <p className="text-xs text-red-600">
                Unpaid leave (LOP)
              </p>
            )}
          </div>

          {/* Right */}
          <div className="flex gap-2">
            {leave.status === "approved" &&
              leave.can?.cancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    cancel.mutate(leave.id)
                  }
                >
                  Cancel
                </Button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
