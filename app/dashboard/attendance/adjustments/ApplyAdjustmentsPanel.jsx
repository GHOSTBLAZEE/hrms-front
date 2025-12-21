"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ApplyAdjustmentsPanel({
  canApply,
  pendingCount,
  onApply,
}) {
  if (!canApply || pendingCount === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Apply Approved Corrections</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          You are about to apply <strong>{pendingCount}</strong>{" "}
          approved corrections.
        </p>

        <p className="text-sm">
          This action:
        </p>
        <ul className="list-disc ml-4 text-sm">
          <li>Does NOT modify original attendance</li>
          <li>Creates payroll-effective adjustments</li>
          <li>Is permanent and auditable</li>
        </ul>

        <Button onClick={onApply}>
          Apply Adjustments
        </Button>
      </AlertDescription>
    </Alert>
  );
}
