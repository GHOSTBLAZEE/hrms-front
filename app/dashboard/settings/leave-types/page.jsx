"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLeaveTypes } from "./useLeaveTypes";
import LeaveTypesTable from "./LeaveTypesTable";
import LeaveTypeDialog from "./LeaveTypeDialog";

export default function LeaveTypesPage() {
  const { list } = useLeaveTypes();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Leave Types</h1>
        <Button onClick={() => setOpen(true)}>
          Add Leave Type
        </Button>
      </div>

      <LeaveTypesTable
        data={list.data || []}
        loading={list.isLoading}
      />

      <LeaveTypeDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
