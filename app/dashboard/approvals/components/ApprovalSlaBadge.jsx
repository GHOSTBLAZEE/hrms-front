"use client";

import { AlertTriangle } from "lucide-react";
import { getSlaMeta, formatDuration } from "../utils/sla";

export default function ApprovalSlaBadge({ step }) {
  const meta = getSlaMeta(step);
  if (!meta) return null;

  if (meta.overdue) {
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
        <AlertTriangle className="h-3 w-3" />
        Overdue by {formatDuration(meta.remainingMs)}
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground">
      SLA remaining {formatDuration(meta.remainingMs)}
    </div>
  );
}
