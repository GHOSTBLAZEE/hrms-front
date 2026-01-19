"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/useAuth";
import { useLeaves } from "@/hooks/useLeaves";
import { useLeavePreview } from "../../employees/[employeeId]/hooks/useLeavePreview";
import { useLeaveTypesRead } from "../hooks/useLeaveTypesRead";

export default function ApplyLeaveDialog({ open, onClose }) {
  const { user } = useAuth();
  const { apply } = useLeaves();
  const { data: leaveTypes, isLoading: loadingTypes } = useLeaveTypesRead();

  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { mutate: preview, data: impact } = useLeavePreview();

  /* ------------------------------------------------------------
   | Impact preview (READ-ONLY)
   |------------------------------------------------------------ */
  useEffect(() => {
    if (leaveTypeId && startDate && endDate) {
      preview({
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [leaveTypeId, startDate, endDate]);

  /* ------------------------------------------------------------
   | Submit
   |------------------------------------------------------------ */
  function submit() {
    apply.mutate(
      {
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Leave</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Leave Type */}
          <div>
            <label className="block mb-1 text-muted-foreground">
              Leave Type
            </label>

            <Select
              value={leaveTypeId}
              onValueChange={setLeaveTypeId}
              disabled={loadingTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>

              <SelectContent>
                {leaveTypes?.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name} ({t.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div>
            <label className="block mb-1 text-muted-foreground">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-muted-foreground">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* 🔮 Impact Preview */}
          {impact && (
            <div
              className={`text-sm ${
                impact.allowed
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {impact.allowed ? (
                <>
                  After approval, you’ll have{" "}
                  <strong>{impact.available_after}</strong>{" "}
                  days remaining.
                </>
              ) : (
                impact.message
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={
                apply.isLoading ||
                !leaveTypeId ||
                !startDate ||
                !endDate ||
                (impact && !impact.allowed)
              }
            >
              Apply Leave
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
