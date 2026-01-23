"use client";

import { useEffectivePermissions } from "@/hooks/useEffectivePermissions";

export default function EffectivePermissionsPage({ params }) {
  const { data, isLoading } = useEffectivePermissions(params.userId);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">
        Effective Permissions
      </h1>

      <table className="w-full border rounded text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Permission</th>
            <th className="p-2 text-left">Source</th>
            <th className="p-2 text-left">Details</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data).map(
            ([permission, meta]) => (
              <tr key={permission} className="border-t">
                <td className="p-2 font-mono">
                  {permission}
                </td>
                <td className="p-2 capitalize">
                  {meta.source}
                </td>
                <td className="p-2 text-muted-foreground">
                  {meta.role && `Role: ${meta.role}`}
                  {meta.expires_at &&
                    `Expires: ${new Date(
                      meta.expires_at
                    ).toLocaleDateString()}`}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
