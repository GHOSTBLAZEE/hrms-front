"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LockActionPanel({
  status,
  canLock,
  canUnlock,
  payrollFinalized,
  onLock,
  onRequestUnlock,
}) {
  /* ------------------------------------------------------------
   | HARD STOP: Payroll finalized
   |------------------------------------------------------------ */
  if (payrollFinalized) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Payroll Finalized</AlertTitle>
        <AlertDescription>
          Attendance for this period is permanently locked because payroll
          has been finalized. No changes are allowed.
        </AlertDescription>
      </Alert>
    );
  }

  /* ------------------------------------------------------------
   | LOCKED STATE
   |------------------------------------------------------------ */
  if (status === "locked") {
    return (
      <Alert>
        <AlertTitle>Attendance Locked</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            This period is frozen and safe for payroll processing.
          </p>

          {canUnlock && (
            <Button
              variant="outline"
              onClick={onRequestUnlock}
            >
              Request Unlock
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  /* ------------------------------------------------------------
   | UNLOCKED BUT CANNOT LOCK
   |------------------------------------------------------------ */
  if (!canLock) {
    return (
      <Alert>
        <AlertTitle>Attendance Open</AlertTitle>
        <AlertDescription>
          Attendance is currently open, but locking is not allowed
          at this time.
        </AlertDescription>
      </Alert>
    );
  }

  /* ------------------------------------------------------------
   | UNLOCKED + CAN LOCK
   |------------------------------------------------------------ */
  return (
    <Alert variant="destructive">
      <AlertTitle>Lock Attendance</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Locking attendance will:</p>

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
