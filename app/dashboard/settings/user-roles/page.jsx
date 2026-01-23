"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useUserRoles, useUpdateUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";

export default function UserRolesPage() {
  const { data, isLoading } = useUserRoles();
  const update = useUpdateUserRoles();

  const [selectedUser, setSelectedUser] = useState(null);
  const [checkedRoles, setCheckedRoles] = useState([]);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  const { users, roles } = data;

  const user = users.find(u => u.id === selectedUser);

  const toggle = (roleId) => {
    setCheckedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const save = () => {
    update.mutate(
      {
        userId: user.id,
        roleIds: checkedRoles,
      },
      {
        onSuccess: () => toast.success("Roles updated"),
        onError: () => toast.error("Failed to update roles"),
      }
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-xl">
      <h1 className="text-xl font-semibold">User Roles</h1>

      {/* User selector */}
      <select
        className="border rounded p-2 w-full"
        value={selectedUser ?? ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedUser(id);

          const u = users.find(u => u.id === id);
          setCheckedRoles(u.roles.map(r => r.id));
        }}
      >
        <option value="">Select user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      {/* Role checkboxes */}
      {user && (
        <>
          <div className="space-y-2">
            {roles.map(role => (
              <label
                key={role.id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={checkedRoles.includes(role.id)}
                  onCheckedChange={() => toggle(role.id)}
                />
                <span className="text-sm">{role.name}</span>
              </label>
            ))}
          </div>

          <Button
            onClick={save}
            disabled={update.isLoading}
          >
            Save Roles
          </Button>
        </>
      )}
    </div>
  );
}
