"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!open) {
      setBasic("");
      setHra("");
      setAllowances("");
      setError(null);
    }
  }, [open]);

  if (!employee) return null;

  const payrollStart =
    payrollYear && payrollMonth
      ? new Date(payrollYear, payrollMonth - 1, 1)
      : null;

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

            if (payrollStart && effectiveFrom > payrollStart) {
              setError(
                `Effective date must be on or before ${payrollStart.toLocaleDateString()}`
              );
              return;
            }

            onSubmit({
              effective_from: e.target.effective_from.value,
              basic: Number(basic),
              hra: Number(hra || 0),
              allowances: Number(allowances || 0),
            });
          }}
          className="space-y-4 mt-4"
        >
          <Input type="date" name="effective_from" required />

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <Input
            type="number"
            placeholder="Basic Salary"
            min="0"
            required
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
          />

          <Input
            type="number"
            placeholder="HRA"
            min="0"
            value={hra}
            onChange={(e) => setHra(e.target.value)}
          />

          <Input
            type="number"
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
