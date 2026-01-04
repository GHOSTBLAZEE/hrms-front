"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function Row({ label, status, hint }) {
  const Icon =
    status === "pass"
      ? CheckCircle2
      : status === "fail"
      ? XCircle
      : AlertTriangle;

  const color =
    status === "pass"
      ? "text-green-600"
      : status === "fail"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
      <div>
        <div className="font-medium text-sm">{label}</div>
        {hint && (
          <div className="text-xs text-muted-foreground">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PayrollPreflightChecklist({
  attendanceLocked,
  missingSalaryEmployees,
  salaryLocked,
  payrollFinalized,
  onFixSalary,
}) {
  const canFinalize =
    attendanceLocked &&
    missingSalaryEmployees.length === 0 &&
    salaryLocked;

  return (
    <div className="border rounded-md p-4 space-y-4 bg-muted/30">
      <h3 className="font-semibold">
        Payroll Pre-Flight Checklist
      </h3>

      <div className="space-y-3">
        <Row
          label="Attendance locked for payroll month"
          status={attendanceLocked ? "pass" : "fail"}
          hint={
            attendanceLocked
              ? null
              : "Attendance must be locked before payroll."
          }
        />

        <Row
          label="Salary structure exists for all employees"
          status={
            missingSalaryEmployees.length === 0
              ? "pass"
              : "fail"
          }
          hint={
            missingSalaryEmployees.length
              ? `${missingSalaryEmployees.length} employees missing salary`
              : null
          }
        />

        <Row
          label="Salary structures are locked for finalized payroll"
          status={salaryLocked ? "pass" : "fail"}
          hint={
            salaryLocked
              ? null
              : "Salary cannot be modified after payroll finalization."
          }
        />

        <Row
          label="Payroll not yet finalized"
          status={payrollFinalized ? "warn" : "pass"}
          hint={
            payrollFinalized
              ? "Payroll already finalized. No changes allowed."
              : null
          }
        />
      </div>

      {missingSalaryEmployees.length > 0 && (
        <Button size="sm" onClick={onFixSalary}>
          Fix Salary Issues
        </Button>
      )}

      <div className="pt-2 text-sm">
        <strong>Status:</strong>{" "}
        {canFinalize ? (
          <span className="text-green-600">
            Ready to finalize payroll
          </span>
        ) : (
          <span className="text-red-600">
            Payroll cannot be finalized
          </span>
        )}
      </div>
    </div>
  );
}
