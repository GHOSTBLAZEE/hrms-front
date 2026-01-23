"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { useAuth } from "@/hooks/useAuth";
import { useLeaveActions } from "@/hooks/useLeaves";

import ApplyLeaveDialog from "./components/ApplyLeaveDialog";
import LeaveBalanceCards from "../employees/[employeeId]/components/LeaveBalanceCards";
import { useMyLeaves } from "./hooks/useMyLeaves";

/* =========================================================
 | Utils
 |========================================================= */
function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return format(d, "dd MMM yyyy");
}

/* =========================================================
 | My Leaves Page (Employee Only)
 |========================================================= */
export default function LeavesPage() {
  const { user } = useAuth();

  // ✅ FIX: correct employee id
  const employeeId = user?.id;

  // ✅ FIX: pass employeeId, not boolean
  const { data: leaves = [], isLoading } = useMyLeaves();


  const { cancel } = useLeaveActions();
  const [open, setOpen] = useState(false);

  if (!employeeId) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Employee profile not linked.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading leaves…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Leaves</h1>

        <Button onClick={() => setOpen(true)}>
          Apply Leave
        </Button>
      </div>

      {/* Apply Leave Dialog */}
      <ApplyLeaveDialog
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Leave Balances */}
      <section>
        <h2 className="text-sm font-medium mb-2">
          Leave Balances
        </h2>

        <LeaveBalanceCards />
      </section>

      {/* Leave History */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">
          Leave History
        </h2>

        {leaves.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No leave records found.
          </div>
        )}

        {leaves.map((leave) => (
          <div
            key={leave.id}
            className="border rounded p-4 flex justify-between items-start"
          >
            {/* Left */}
            <div className="space-y-1">
              <p className="font-medium">
                {leave.leave_type?.name ?? "Leave"}
              </p>

              <p className="text-sm text-muted-foreground">
                {formatDate(leave.start_date)} →{" "}
                {formatDate(leave.end_date)} ·{" "}
                <strong>{leave.days}</strong> days
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

            {/* Actions */}
            <div className="flex gap-2">
              {leave.status === "approved" &&
                leave.can?.cancel && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => cancel.mutate(leave.id)}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
