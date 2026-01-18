"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

/* =========================================================
 | Checklist Row
 |========================================================= */
function Row({ label, status, hint }) {
  const config = {
    pass: { Icon: CheckCircle2, color: "text-green-600" },
    fail: { Icon: XCircle, color: "text-red-600" },
    warn: { Icon: AlertTriangle, color: "text-yellow-600" },
  };

  const { Icon, color } = config[status];

  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && (
          <div className="text-xs text-muted-foreground">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 | Payroll Preflight Checklist
 |========================================================= */
export default function PayrollPreflightChecklist({
  attendanceLocked,
  missingSalaryEmployees = [], // [{ id, name }]
  payrollFinalized,
  statutory, // { pf_missing_uan, pf_missing_employee_ids, esi_missing_employee_ids, esi_eligible }
  onFixStatutory,
  onFixSalary,
}) {
  const router = useRouter();

  /* ---------------- Derived state ---------------- */

  const hasMissingSalary = missingSalaryEmployees.length > 0;

  const pfMissingUan = statutory?.pf_missing_uan ?? 0;
  const pfMissingIds = statutory?.pf_missing_employee_ids ?? [];

  const esiEligible = statutory?.esi_eligible ?? 0;
  const esiMissingIds = statutory?.esi_missing_employee_ids ?? [];

  const canFinalize =
    !payrollFinalized &&
    attendanceLocked &&
    !hasMissingSalary &&
    pfMissingUan === 0 &&
    (esiEligible === 0 || esiMissingIds.length === 0);

  /* ---------------- Blocking reasons (clickable) ---------------- */

  const blockingItems = [];

  if (!attendanceLocked) {
    blockingItems.push({
      key: "attendance",
      label: "Attendance is not locked",
      onClick: () =>
        router.push("/dashboard/attendance/locks"),
    });
  }

  if (hasMissingSalary) {
    const employeeIds = missingSalaryEmployees.map(e => e.id);

    blockingItems.push({
      key: "salary",
      label: `${employeeIds.length} employees missing salary structure`,
      onClick: () => {
        router.push(
          `/dashboard/employees?highlight=${employeeIds.join(",")}&tab=salary`
        );
      },
    });
  }


  if (pfMissingUan > 0) {
    blockingItems.push({
      key: "pf",
      label: `${pfMissingUan} employees missing PF UAN`,
      onClick: () => onFixStatutory?.(pfMissingIds),
    });
  }

  if (esiEligible > 0 && esiMissingIds.length > 0) {
    blockingItems.push({
      key: "esi",
      label: `${esiMissingIds.length} employees missing ESI number`,
      onClick: () => onFixStatutory?.(esiMissingIds),
    });
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="rounded-md border bg-muted/30 p-4 space-y-4">
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
          status={hasMissingSalary ? "fail" : "pass"}
          hint={
            hasMissingSalary
              ? `${missingSalaryEmployees.length} employees missing salary`
              : null
          }
        />

        <Row
          label="PF statutory data complete (UAN)"
          status={pfMissingUan === 0 ? "pass" : "fail"}
          hint={
            pfMissingUan > 0
              ? `${pfMissingUan} employees missing UAN`
              : "All PF-applicable employees have UAN"
          }
        />

        {esiEligible > 0 && (
          <Row
            label="ESI statutory data complete"
            status={esiMissingIds.length === 0 ? "pass" : "fail"}
            hint={
              esiMissingIds.length > 0
                ? `${esiMissingIds.length} employees missing ESI number`
                : "All ESI-eligible employees covered"
            }
          />
        )}

        {payrollFinalized ? (
          <Row
            label="Payroll already finalized"
            status="pass"
            hint="This payroll run is immutable."
          />
        ) : (
          <Row
            label="Payroll not yet finalized"
            status="warn"
            hint="Finalize payroll once all checks pass."
          />
        )}
      </div>

      {/* ---------------- Actions ---------------- */}

      {!payrollFinalized && pfMissingUan > 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onFixStatutory?.(pfMissingIds)}
        >
          Fix Statutory Details
        </Button>
      )}

      {!payrollFinalized && hasMissingSalary && (
        <Button
          size="sm"
          onClick={() => onFixSalary?.()}
        >
          Fix Salary Issues
        </Button>
      )}

      {/* ---------------- Footer with Tooltip ---------------- */}

      <div className="pt-2 text-sm">
        <strong>Status:</strong>{" "}
        {payrollFinalized ? (
          <span className="text-muted-foreground">
            Payroll finalized (read-only)
          </span>
        ) : canFinalize ? (
          <span className="text-green-600">
            Ready to finalize payroll
          </span>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-red-600 cursor-help underline decoration-dotted">
                  Payroll cannot be finalized
                </span>
              </TooltipTrigger>

              <TooltipContent side="top" align="start">
                <div className="space-y-2 max-w-xs">
                  <div className="text-sm font-medium">
                    Blocking issues
                  </div>

                  <ul className="space-y-1">
                    {blockingItems.map((item) => (
                      <li
                        key={item.key}
                        onClick={item.onClick}
                        className="text-xs cursor-pointer rounded px-1 py-0.5 hover:bg-muted underline"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>

                  <div className="text-[11px] text-muted-foreground">
                    Click an item to jump to affected employees
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
