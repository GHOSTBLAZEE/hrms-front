"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";

function BulkApprovalBar({
  count,
  onApprove,
  onReject,
  disabled = false,
  isApproving = false,
  isRejecting = false,
}) {
  if (!count) return null;

  const isBusy = disabled || isApproving || isRejecting;

  return (
    <div
      className="flex items-center justify-between rounded-md border bg-muted/30 p-3"
      role="region"
      aria-label="Bulk approval actions"
    >
      <span className="text-sm font-medium">
        {count} selected
        {count > 1 ? " items" : " item"}
      </span>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isBusy}
          aria-disabled={isBusy}
          onClick={onReject}
        >
          {isRejecting ? "Rejecting…" : "Reject Selected"}
        </Button>

        <Button
          size="sm"
          disabled={isBusy}
          aria-disabled={isBusy}
          onClick={onApprove}
        >
          {isApproving ? "Approving…" : "Approve Selected"}
        </Button>
      </div>
    </div>
  );
}

export default memo(BulkApprovalBar);
