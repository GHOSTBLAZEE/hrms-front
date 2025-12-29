"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSummary from "../[employeeId]/components/ProfileSummary";
import EditProfileForm from "../[employeeId]/components/EditProfileForm";

export default function OverviewTab({ employee }) {
  const { user, permissions = [], isLoading } = useAuth();

  const canEdit =
    permissions?.includes("update employees");

  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <ProfileSummary employee={employee} />

      {canEdit && !editing && (
        <button
          className="text-sm underline"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      )}

      {editing && (
        <EditProfileForm
          employee={employee}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
