"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLeaveTypes } from "./useLeaveTypes";

export default function LeaveTypesTable({ data, loading }) {
  const { update, remove } = useLeaveTypes();

  if (loading) return <div>Loading leave types…</div>;

  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave types configured yet.
      </div>
    );
  }

  return (
    <div className="border rounded">
      {data.map((t) => (
        <div
          key={t.id}
          className="grid grid-cols-6 items-center gap-4 border-b p-3 text-sm"
        >
          <div className="font-medium">{t.name}</div>
          <div>{t.code}</div>

          
            {/* Paid / Unpaid (IMMUTABLE) */}
          <div className="flex items-center gap-2">
            <Switch checked={t.is_paid} disabled />
            <span className="text-xs text-muted-foreground">
              immutable
            </span>
          </div>

          

          <div>
            <Switch
              checked={t.requires_approval}
              onCheckedChange={(v) =>
                update.mutate({
                  id: t.id,
                  requires_approval: v,
                })
              }
            />
          </div>

          <div className="text-muted-foreground">
            days
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => remove.mutate(t.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
