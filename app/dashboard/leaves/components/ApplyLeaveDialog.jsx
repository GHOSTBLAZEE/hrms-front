"use client";

import { useEffect, useMemo, useState } from "react";
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

import { useLeavePreview } from "../hooks/useLeavePreview";
import { useLeaveTypesRead } from "../hooks/useLeaveTypesRead";
import { useLeaveActions } from "@/hooks/useLeaves";

export default function ApplyLeaveDialog({ open, onClose }) {
  const { apply } = useLeaveActions();
  const { data: leaveTypes, isLoading } = useLeaveTypesRead();

  const {
    mutate: preview,
    data: impact,
    error: previewError,
    isError: isPreviewError,
    isPending: isPreviewLoading,
  } = useLeavePreview();

  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ackUnpaid, setAckUnpaid] = useState(false);

  const leaveTypeList = leaveTypes?.data ?? [];

  /* ---------------- Derived ---------------- */
  const selectedType = useMemo(
    () =>
      leaveTypeList.find(
        (t) => String(t.id) === String(leaveTypeId)
      ),
    [leaveTypeId, leaveTypeList]
  );

  const isUnpaidLeave = selectedType?.is_paid === false;

  const canPreview =
    open && leaveTypeId && startDate && endDate;

  /* ---------------- Preview ---------------- */
  useEffect(() => {
    if (!canPreview) return;

    preview({
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
    });
  }, [canPreview, leaveTypeId, startDate, endDate, preview]);

  /* ---------------- Reset ---------------- */
  useEffect(() => {
    if (!open) {
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
      setAckUnpaid(false);
    }
  }, [open]);

  /* ---------------- Submit ---------------- */
  function submit() {
    apply.mutate(
      {
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: onClose,
        onError: (err) => {
          alert(
            err?.response?.data?.message ??
              "Unable to apply leave"
          );
        },
      }
    );
  }

  const disableApply =
    apply.isLoading ||
    isPreviewLoading ||
    !leaveTypeId ||
    !startDate ||
    !endDate ||
    isPreviewError || // ✅ BLOCK overlap
    (impact && !impact.allowed) ||
    (isUnpaidLeave && !ackUnpaid);

  /* ---------------- Render ---------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Leave</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Leave Type */}
          <Select
            value={leaveTypeId}
            onValueChange={(v) => {
              setLeaveTypeId(v);
              setAckUnpaid(false);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypeList.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name} ({t.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dates */}
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* 🔴 Overlap / business-rule error */}
          {isPreviewError && (
            <div className="text-sm text-red-600">
              {previewError?.response?.data?.message ??
                "Leave not allowed for selected dates"}
            </div>
          )}

          {/* 🔮 Balance Preview */}
          {!isPreviewError && impact && (
            <div
              className={`text-sm ${
                impact.allowed
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {impact.allowed ? (
                impact.available_after !== null ? (
                  <>
                    Remaining balance after approval:{" "}
                    <strong>{impact.available_after}</strong>{" "}
                    days
                  </>
                ) : (
                  <>This leave will be unpaid (LOP)</>
                )
              ) : (
                "Insufficient leave balance"
              )}
            </div>
          )}

          {/* Unpaid Leave Warning */} {isUnpaidLeave && ( <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700"> <div className="font-medium mb-1"> Unpaid Leave (Loss of Pay) </div> <div> This leave is <strong>unpaid</strong>. Approved days will reduce salary in payroll. </div> <label className="mt-2 flex gap-2"> <input type="checkbox" checked={ackUnpaid} onChange={(e) => setAckUnpaid(e.target.checked) } /> <span> I understand the salary deduction </span> </label> </div> )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={disableApply}>
              Apply Leave
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
