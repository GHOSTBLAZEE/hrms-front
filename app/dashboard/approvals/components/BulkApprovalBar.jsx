import { Button } from "@/components/ui/button";

export default function BulkApprovalBar({
  count,
  onApprove,
  onReject,
  disabled,
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
      <span className="text-sm">
        {count} selected
      </span>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={onReject}
        >
          Reject Selected
        </Button>

        <Button
          size="sm"
          disabled={disabled}
          onClick={onApprove}
        >
          Approve Selected
        </Button>
      </div>
    </div>
  );
}
