"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

export default function FinalizePayrollDialog({
  disabled,
  loading,
  onConfirm,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={disabled || loading}
        >
          Finalize Payroll
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Finalize Payroll?
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to <strong>finalize payroll</strong>.
            </p>

            <ul className="list-disc pl-4 text-sm">
              <li>Attendance becomes immutable</li>
              <li>Salary structures are locked</li>
              <li>Payslips are permanently generated</li>
              <li>This action <strong>cannot be undone</strong></li>
            </ul>

            <p className="text-sm text-muted-foreground">
              Please confirm only if all checks are complete.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Finalizing…" : "Yes, Finalize Payroll"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
