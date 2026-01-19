"use client";

import { Button } from "@/components/ui/button";
import { useLeaves } from "@/hooks/useLeaves";


import { useState } from "react";
import ApplyLeaveDialog from "./components/ApplyLeaveDialog";

export default function LeavesPage() {
  const { data, isLoading, approve, cancel } = useLeaves();
  const [open, setOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Leaves</h1>

        <Button onClick={() => setOpen(true)}>
          Apply Leave
        </Button>
      </div>

      <ApplyLeaveDialog open={open} onClose={() => setOpen(false)} />

      {data?.data.map((leave) => (
        <div
          key={leave.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{leave.leave_type.name}</p>
            <p className="text-sm text-muted-foreground">
              {leave.start_date} → {leave.end_date} ({leave.days} days)
            </p>
            <p className="text-sm capitalize">{leave.status}</p>
          </div>

          <div className="flex gap-2">
            {leave.can.approve && (
              <Button size="sm" onClick={() => approve.mutate(leave.id)}>
                Approve
              </Button>
            )}

            {leave.can.cancel && (
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
    </div>
  );
}
