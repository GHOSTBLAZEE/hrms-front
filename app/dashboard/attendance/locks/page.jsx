"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";
import { QUERY_CONFIGS } from "@/config/queryConfig";

import AttendanceLockHeader from "./AttendanceLockHeader";
import LockSummaryCard from "./LockSummaryCard";
import LockActionPanel from "./LockActionPanel";
import LockHistoryTable from "./LockHistoryTable";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DEFAULT_LOCK = {
  status: "unlocked",
  can_lock: false,
  can_unlock: false,
  payroll_finalized: false,
  summary: {},
  history: [],
};

/* ----------------------------------------------------------------
 | Unlock reason dialog — FIX: manager must enter their own reason
 |----------------------------------------------------------------*/
function UnlockReasonDialog({ open, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError("Please provide a reason (minimum 10 characters).");
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Attendance Unlock</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="unlock-reason">
            Reason for unlock request <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="unlock-reason"
            placeholder="Describe why attendance needs to be unlocked (e.g. missed corrections after payroll review)…"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Submitting…" : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------------------
 | Page
 |----------------------------------------------------------------*/
export default function AttendanceLockPage() {
  const queryClient = useQueryClient();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);

  const [year, m] = month.split("-");
  const yearNum  = Number(year);
  const monthNum = Number(m);

  /* ----------------------------------------
   | Fetch lock state
   |----------------------------------------*/
  const { data: lockData, isLoading } = useQuery({
    queryKey: ["attendance-lock", month],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/attendance-locks/${month}`);
      return res.data;
    },
    // FIX: use shared config (FRESH) instead of inline staleTime
    // attendance-lock is mutable — was wrongly IMMUTABLE before
    ...QUERY_CONFIGS.FRESH,
    onError: (error) => {
      handleApiError(error, { fallback: "Failed to load attendance lock status" });
    },
  });

  const lock = lockData ?? DEFAULT_LOCK;

  /* ----------------------------------------
   | Lock mutation
   |----------------------------------------*/
  const lockMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/v1/attendance-locks/${month}/lock`),
    onSuccess: () => {
      toast.success("Attendance locked successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance-lock", month] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: "Unable to lock attendance" });
    },
  });

  /* ----------------------------------------
   | Request unlock mutation
   |----------------------------------------*/
  const requestUnlockMutation = useMutation({
    mutationFn: (reason) =>
      apiClient.post("/api/v1/attendance-unlock-requests", {
        year: yearNum,
        month: monthNum,
        reason,
      }),
    onSuccess: () => {
      toast.success("Unlock request submitted for approval");
      setUnlockDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["attendance-lock", month] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: "Failed to request unlock" });
    },
  });

  /* ----------------------------------------
   | Render
   |----------------------------------------*/
  if (isLoading) {
    return <div className="p-6">Loading attendance lock…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <AttendanceLockHeader
        month={month}
        setMonth={setMonth}
        status={lock.status}
      />

      <LockSummaryCard summary={lock.summary} />

      <LockActionPanel
        status={lock.status}
        canLock={lock.can_lock}
        canUnlock={lock.can_unlock}
        payrollFinalized={lock.payroll_finalized}
        locking={lockMutation.isPending}
        unlocking={requestUnlockMutation.isPending}
        onLock={() => lockMutation.mutate()}
        onRequestUnlock={() => setUnlockDialogOpen(true)}
      />

      <LockHistoryTable history={lock.history} />

      {/* FIX: Manager enters their own reason — no hardcoded string */}
      <UnlockReasonDialog
        open={unlockDialogOpen}
        onClose={() => setUnlockDialogOpen(false)}
        onConfirm={(reason) => requestUnlockMutation.mutate(reason)}
        isLoading={requestUnlockMutation.isPending}
      />
    </div>
  );
}