"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSummary from "../[employeeId]/components/ProfileSummary";
import EditProfileDrawer from "../[employeeId]/components/EditProfileDrawer";
import { Button } from "@/components/ui/button";

export default function OverviewTab({ employee }) {
  const { permissions = [] } = useAuth();
  const canEdit = permissions.includes("update employees");

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <ProfileSummary employee={employee} />

      {/* Actions */}
      {canEdit && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      )}

      <EditProfileDrawer
        open={open}
        onClose={() => setOpen(false)}
        employee={employee}
      />
    </div>
  );
}
