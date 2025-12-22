"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";

function JsonBlock({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No additional data
      </div>
    );
  }

  return (
    <pre className="text-xs bg-muted rounded-md p-3 overflow-auto max-h-64">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function AuditLogDrawer({ open, onClose, log }) {
  if (!log) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] sm:w-[520px]">
        <SheetHeader>
          <SheetTitle>Audit Log Detail</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 text-sm">
          {/* Event */}
          <Detail label="Event" value={log.event} mono />

          {/* Description */}
          <Detail label="Description" value={log.description} />

          {/* User */}
          <Detail
            label="Triggered By"
            value={log.causer?.name || "System"}
          />

          {/* Timestamp */}
          <Detail
            label="Date & Time"
            value={format(new Date(log.created_at), "PPpp")}
          />

          {/* Subject */}
          {log.subject_type && (
            <Detail
              label="Subject"
              value={`${log.subject_type} #${log.subject_id}`}
            />
          )}

          {/* Properties */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Properties
            </div>
            <JsonBlock data={log.properties} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={
          mono
            ? "font-mono text-xs bg-muted rounded px-2 py-1 inline-block"
            : "font-medium"
        }
      >
        {value ?? "-"}
      </div>
    </div>
  );
}
