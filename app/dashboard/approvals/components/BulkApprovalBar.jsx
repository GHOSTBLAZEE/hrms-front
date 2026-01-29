"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BulkApprovalBar({
  count,
  disabled = false,
  isApproving = false,
  isRejecting = false,
  onApprove,
  onReject,
}) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">{count}</span>
        </div>
        <div>
          <p className="text-sm font-medium">
            {count} {count === 1 ? "request" : "requests"} selected
          </p>
          <p className="text-xs text-muted-foreground">
            Choose an action to apply to all selected items
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onReject}
          className="gap-2"
        >
          {isRejecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rejecting...
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              Reject {count > 1 ? "All" : ""}
            </>
          )}
        </Button>

        <Button
          size="sm"
          disabled={disabled}
          onClick={onApprove}
          className="gap-2"
        >
          {isApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Approve {count > 1 ? "All" : ""}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}