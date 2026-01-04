"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SalaryBreakdownPreview from "./SalaryBreakdownPreview";

export default function SalaryStructureDrawer({
  open,
  onClose,
  employee,
  payrollYear,
  payrollMonth,
  onSubmit,
  loading = false,
}) {
  const [basic, setBasic] = useState("");
  const [hra, setHra] = useState("");
  const [allowances, setAllowances] = useState("");
  const [error, setError] = useState(null);

  if (!employee) return null;

  const payrollStart = new Date(
    payrollYear,
    payrollMonth - 1,
    1
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[480px]">
        <SheetHeader>
          <SheetTitle>
            New Salary Structure – {employee.employee_code}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            const effectiveFrom = new Date(
              e.target.effective_from.value
            );

            // 🚨 VALIDATION
            if (effectiveFrom > payrollStart) {
              setError(
                `Effective date must be on or before ${
                  payrollStart.toLocaleDateString()
                } for this payroll run.`
              );
              return;
            }

            onSubmit({
              employee_id: employee.id,
              effective_from: e.target.effective_from.value,
              basic: Number(basic),
              hra: Number(hra || 0),
              allowances: Number(allowances || 0),
            });
          }}
          className="space-y-4 mt-4"
        >
          <Input
            type="date"
            name="effective_from"
            required
          />

          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}

          <Input
            type="number"
            name="basic"
            placeholder="Basic Salary"
            min="0"
            required
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
          />

          <Input
            type="number"
            name="hra"
            placeholder="HRA"
            min="0"
            value={hra}
            onChange={(e) => setHra(e.target.value)}
          />

          <Input
            type="number"
            name="allowances"
            placeholder="Other Allowances"
            min="0"
            value={allowances}
            onChange={(e) => setAllowances(e.target.value)}
          />

          <SalaryBreakdownPreview
            basic={basic}
            hra={hra}
            allowances={allowances}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create Structure"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
