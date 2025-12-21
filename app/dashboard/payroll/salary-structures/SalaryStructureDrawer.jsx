"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SalaryBreakdownPreview from "./SalaryBreakdownPreview";

export default function SalaryStructureDrawer({
  open,
  onClose,
  employee,
  components,
  onSubmit,
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[480px]">
        <SheetHeader>
          <SheetTitle>
            New Salary Structure – {employee?.name}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4 mt-4"
        >
          <Input
            type="date"
            name="effective_from"
            required
          />

          <Input
            type="number"
            name="ctc"
            placeholder="Annual CTC"
            required
          />

          <SalaryBreakdownPreview
            components={components}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Structure
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
