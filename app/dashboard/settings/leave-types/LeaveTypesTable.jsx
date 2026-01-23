"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLeaveTypes } from "./useLeaveTypes";

export default function LeaveTypesTable({
  data,
  loading,
  onCreateVersion,
  showInactive,
  onToggleInactive,
}) {
  const { update, remove } = useLeaveTypes();

  if (loading) {
    return <div>Loading leave types…</div>;
  }

  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave types configured yet.
      </div>
    );
  }

  return (
    <div className="border rounded space-y-2">
      {/* Toggle */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <Switch
          checked={showInactive}
          onCheckedChange={onToggleInactive}
        />
        <span className="text-sm">
          Show deactivated leave types
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-7 gap-4 border-b bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
        <div>Leave Name</div>
        <div>Code</div>
        <div>Is Paid</div>
        <div>Requires Approval</div>
        <div>Limit</div>
        <div></div>
        <div></div>
      </div>

      {/* Rows */}
      {data.map((t) => (
        <div
          key={t.id}
          className={[
            "grid grid-cols-7 items-center gap-4 border-b p-3 text-sm last:border-b-0",
            !t.is_active && "opacity-60",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="font-medium">{t.name}</div>
          <div>{t.code}</div>

          <div className="flex items-center gap-2">
            <Switch checked={t.is_paid} disabled />
            <span className="text-xs text-muted-foreground">
              immutable
            </span>
          </div>

          <div>
            <Switch
              checked={!!t.requires_approval}
              onCheckedChange={(v) =>
                update.mutate({
                  id: t.id,
                  requires_approval: v,
                })
              }
            />
          </div>

          <div className="text-muted-foreground">
            {t.annual_limit ?? "—"} days
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onCreateVersion(t)}
          >
            New Version
          </Button>

          {t.is_active ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                update.mutate({
                  id: t.id,
                  is_active: false,
                })
              }
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => remove.mutate(t.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
