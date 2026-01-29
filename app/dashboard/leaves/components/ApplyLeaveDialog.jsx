"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertCircle, CheckCircle2, Loader2, TrendingDown } from "lucide-react";

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
  const [reason, setReason] = useState("");
  const [ackUnpaid, setAckUnpaid] = useState(false);

  const leaveTypeList = leaveTypes?.data ?? [];

  const selectedType = useMemo(
    () => leaveTypeList.find((t) => String(t.id) === String(leaveTypeId)),
    [leaveTypeId, leaveTypeList]
  );

  const isUnpaidLeave = selectedType?.is_paid === false;
  const canPreview = open && leaveTypeId && startDate && endDate;

  useEffect(() => {
    if (!canPreview) return;
    preview({
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
    });
  }, [canPreview, leaveTypeId, startDate, endDate, preview]);

  useEffect(() => {
    if (!open) {
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setAckUnpaid(false);
    }
  }, [open]);

  function submit() {
    apply.mutate(
      {
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim() || undefined,
      },
      { onSuccess: onClose }
    );
  }

  const disableApply =
    apply.isPending ||
    isPreviewLoading ||
    !leaveTypeId ||
    !startDate ||
    !endDate ||
    isPreviewError ||
    (impact && !impact.allowed) ||
    (isUnpaidLeave && !ackUnpaid);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Apply for Leave</DialogTitle>
              <DialogDescription>
                Submit your leave request for approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type *</Label>
            <Select value={leaveTypeId} onValueChange={(v) => {
              setLeaveTypeId(v);
              setAckUnpaid(false);
            }} disabled={isLoading}>
              <SelectTrigger id="leave-type" className="h-11">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypeList.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground">({t.code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="h-11"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Provide a brief reason for your leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Preview Loading */}
          {isPreviewLoading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Calculating leave impact...</AlertDescription>
            </Alert>
          )}

          {/* Overlap Error */}
          {isPreviewError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {previewError?.response?.data?.message || "Leave not allowed for selected dates"}
              </AlertDescription>
            </Alert>
          )}

          {/* Balance Preview */}
          {!isPreviewError && impact && (
            <Alert className={impact.allowed ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" : "border-rose-200 bg-rose-50 text-rose-900"}>
              {impact.allowed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className="font-medium">
                {impact.allowed ? (
                  impact.available_after !== null ? (
                    <span>
                      Remaining balance after approval: <strong>{impact.available_after} days</strong>
                    </span>
                  ) : (
                    "This leave will be marked as Loss of Pay (LOP)"
                  )
                ) : (
                  "Insufficient leave balance for this request"
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Unpaid Warning */}
          {isUnpaidLeave && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <TrendingDown className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-amber-900 dark:text-amber-400 mb-1">
                      Unpaid Leave (Loss of Pay)
                    </div>
                    <div className="text-sm text-amber-800 dark:text-amber-500">
                      This leave type is <strong>unpaid</strong>. Approved days will result in salary deduction during payroll processing.
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ackUnpaid}
                      onChange={(e) => setAckUnpaid(e.target.checked)}
                      className="mt-1 rounded border-amber-300"
                    />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-400">
                      I understand and acknowledge the salary deduction
                    </span>
                  </label>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={apply.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={disableApply} className="gap-2">
            {apply.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Leave Request
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}