"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function PayrollEmployeeDrawer({ employee, onClose }) {
  if (!employee) return null;

  return (
    <Sheet open={!!employee} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[480px]">
        <SheetHeader>
          <SheetTitle>{employee.employee_name}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3 text-sm">
          <Row label="Paid Days" value={employee.paid_days} />
          <Row label="Basic" value={employee.basic} />
          <Row label="HRA" value={employee.hra} />
          <Row label="Allowances" value={employee.allowances} />
          <Row label="Deductions" value={employee.deductions} />
          <Row label="Net Pay" value={employee.net_pay} strong />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
}
