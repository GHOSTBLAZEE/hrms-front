"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function RunPayrollPanel({
  canRun,
  status,
  onRun,
}) {
  if (!canRun || status !== "draft") return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Finalize Payroll Attendance</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          This will create a permanent payroll snapshot.
        </p>

        <ul className="list-disc ml-4 text-sm">
          <li>Attendance is frozen forever</li>
          <li>Adjustments are locked</li>
          <li>Payroll calculation can begin</li>
        </ul>

        <Button onClick={onRun}>
          Finalize Attendance Snapshot
        </Button>
      </AlertDescription>
    </Alert>
  );
}
