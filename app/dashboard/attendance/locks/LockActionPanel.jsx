"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LockActionPanel({
  status,
  canLock,
  onLock,
}) {
  if (status === "locked") {
    return (
      <Alert>
        <AlertTitle>Attendance Locked</AlertTitle>
        <AlertDescription>
          This period is frozen and safe for payroll processing.
        </AlertDescription>
      </Alert>
    );
  }

  if (!canLock) return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Lock Attendance</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Locking attendance will:
        </p>
        <ul className="list-disc ml-4 text-sm">
          <li>Prevent new punches</li>
          <li>Stop correction requests</li>
          <li>Freeze data for payroll</li>
        </ul>

        <Button onClick={onLock}>
          Lock Attendance
        </Button>
      </AlertDescription>
    </Alert>
  );
}
