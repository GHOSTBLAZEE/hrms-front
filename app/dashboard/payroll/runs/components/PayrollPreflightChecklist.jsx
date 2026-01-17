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
  payrollFinalized,
  onFixSalary,
}) {
  const canFinalize =
    !payrollFinalized &&
    attendanceLocked &&
    missingSalaryEmployees.length === 0;

  return (
    <div className="border rounded-md p-4 space-y-4 bg-muted/30">
      <h3 className="font-semibold">
        Payroll Pre-Flight Checklist
      </h3>

      <div className="space-y-3">
        {/* Attendance */}
        <Row
          label="Attendance locked for payroll month"
          status={attendanceLocked ? "pass" : "fail"}
          hint={
            attendanceLocked
              ? null
              : "Attendance must be locked before payroll."
          }
        />

        {/* Salary */}
        <Row
          label="Salary structure exists for all employees"
          status={
            missingSalaryEmployees.length === 0
              ? "pass"
              : "fail"
          }
          hint={
            missingSalaryEmployees.length > 0
              ? `${missingSalaryEmployees.length} employees missing salary`
              : null
          }
        />

        {/* Payroll state */}
        {payrollFinalized ? (
          <Row
            label="Payroll already finalized"
            status="pass"
            hint="This payroll run is immutable. No changes allowed."
          />
        ) : (
          <Row
            label="Payroll not yet finalized"
            status="warn"
            hint="Finalize payroll once all checks pass."
          />
        )}
      </div>

      {/* Fix salary CTA */}
      {!payrollFinalized &&
        missingSalaryEmployees.length > 0 && (
          <Button size="sm" onClick={onFixSalary}>
            Fix Salary Issues
          </Button>
        )}

      {/* Status footer */}
      <div className="pt-2 text-sm">
        <strong>Status:</strong>{" "}
        {payrollFinalized ? (
          <span className="text-gray-600">
            Payroll finalized (read-only)
          </span>
        ) : canFinalize ? (
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
