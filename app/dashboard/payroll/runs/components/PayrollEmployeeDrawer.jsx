"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function PayrollEmployeeDrawer({
  employee,
  onClose,
}) {
  if (!employee) return null;

  return (
    <Sheet open={!!employee} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[480px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            {employee.employee_name}
          </SheetTitle>
        </SheetHeader>

        {/* Snapshot notice */}
        <div className="mt-3 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          This payroll data is a locked snapshot.
          Attendance, salary structure, and deductions
          cannot be modified.
        </div>

        {/* Attendance */}
        <Section title="Attendance">
          <Row
            label="Paid Days"
            value={employee.paid_days}
          />
        </Section>

        {/* Earnings */}
        <Section title="Earnings">
          <Row
            label="Basic Salary"
            value={employee.basic}
          />
          <Row
            label="HRA"
            value={employee.hra}
          />
          <Row
            label="Other Allowances"
            value={employee.allowances}
          />
        </Section>

        {/* Deductions */}
        <Section title="Deductions">
          <Row
            label="Total Deductions"
            value={employee.deductions}
          />
        </Section>

        {/* Net Pay */}
        <div className="mt-6 rounded-md border bg-muted/20 p-4">
          <Row
            label="Net Pay"
            value={employee.net_pay}
            strong
            large
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ----------------------------
 | Helpers
 |----------------------------*/
function Section({ title, children }) {
  return (
    <div className="mt-6 space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, strong, large }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span
        className={[
          strong ? "font-semibold" : "",
          large ? "text-base" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
