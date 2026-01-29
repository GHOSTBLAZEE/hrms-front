"use client";

import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import { getSlaMeta, formatRemaining } from "../utils/sla";

export default function ApprovalSlaBar({ step }) {
  const meta = getSlaMeta(step);
  if (!meta) return null;

  const { progress, remainingMs, overdue, level } = meta;

  return (
    <div className="mt-2 space-y-1">
      {/* Text */}
      <div
        className={clsx(
          "flex items-center gap-1 text-xs font-medium",
          overdue && "text-red-600",
          level === "warning" && "text-yellow-600"
        )}
      >
        {overdue && <AlertTriangle className="h-3 w-3" />}
        {overdue
          ? `Overdue by ${formatRemaining(remainingMs)}`
          : `Due in ${formatRemaining(remainingMs)}`}
      </div>

      {/* Bar */}
      <div className="h-1.5 w-full rounded bg-muted overflow-hidden">
        <div
          className={clsx(
            "h-full transition-all",
            level === "ok" && "bg-green-500",
            level === "warning" && "bg-yellow-500",
            level === "danger" && "bg-red-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
