"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { usePermissions, useUpdateRolePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

export default function PermissionsPage() {
  const { data, isLoading } = usePermissions();
  const update = useUpdateRolePermissions();

  const [selectedRole, setSelectedRole] = useState(null);
  const [checked, setChecked] = useState([]);

  if (isLoading) return <div>Loading…</div>;

  const roles = data.roles;
  const groups = data.permission_groups;

  const role = roles.find(r => r.id === selectedRole);

  const toggle = (perm) => {
    setChecked(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };

  const save = () => {
    update.mutate(
      { roleId: role.id, permissions: checked },
      {
        onSuccess: () => toast.success("Permissions updated"),
        onError: () => toast.error("Failed to update permissions"),
      }
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">Permissions</h1>

      {/* Role selector */}
      <select
        className="border rounded p-2"
        value={selectedRole ?? ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedRole(id);

          const role = roles.find(r => r.id === id);
          setChecked(role.permissions.map(p => p.name));
        }}
      >
        <option value="">Select role</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Matrix */}
      {role && (
        <>
          {Object.entries(groups).map(([group, perms]) => (
            <div key={group}>
              <h2 className="font-medium mt-4">{group}</h2>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {perms.map(p => (
                  <label key={p} className="flex items-center gap-2">
                    <Checkbox
                      checked={checked.includes(p)}
                      onCheckedChange={() => toggle(p)}
                    />
                    <span className="text-sm">{p}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={save} disabled={update.isLoading}>
            Save Permissions
          </Button>
        </>
      )}
    </div>
  );
}
