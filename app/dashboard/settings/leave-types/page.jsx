"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLeaveTypes } from "./useLeaveTypes";
import LeaveTypesTable from "./LeaveTypesTable";
import LeaveTypeDialog from "./LeaveTypeDialog";

export default function LeaveTypesPage() {
  const [showInactive, setShowInactive] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { list } = useLeaveTypes({
    includeInactive: showInactive,
  });

  const loading = !list || list.isLoading;
  const data = list?.data?.data?.data ?? [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Leave Types</h1>

        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Add Leave Type
        </Button>
      </div>

      <LeaveTypesTable
        data={data}
        loading={loading}
        showInactive={showInactive}
        onToggleInactive={setShowInactive}
        onCreateVersion={(t) => {
          setEditing(t);
          setOpen(true);
        }}
      />

      <LeaveTypeDialog
        open={open}
        initialData={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
