"use client";

import { cn } from "@/lib/utils";

/**
 * AdjustmentDiffCell
 *
 * Props:
 * - original: string | number | null
 * - adjusted: string | number | null
 * - suffix?: string (eg: "h")
 */
export default function AdjustmentDiffCell({
  original,
  adjusted,
  suffix = "",
}) {
  // Normalize null / undefined
  const orig = original ?? "-";
  const adj = adjusted ?? "-";

  const hasChanged = orig !== adj;

  // No change → show single muted value
  if (!hasChanged) {
    return (
      <span className="text-muted-foreground">
        {orig}
        {suffix}
      </span>
    );
  }

  // Changed → show diff
  return (
    <div className="flex flex-col leading-tight">
      <span className="line-through text-xs text-muted-foreground">
        {orig}
        {suffix}
      </span>
      <span className="text-sm font-medium text-green-700">
        {adj}
        {suffix}
      </span>
    </div>
  );
}
