"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RequestCorrectionDialog({
  open,
  onClose,
  onSubmit,
  attendance,
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");

  if (!attendance) return null;

  const isValid =
    (checkIn || checkOut) && reason.trim().length >= 5;

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) return;

    onSubmit({
      attendance_id: attendance.id,
      requested_check_in: checkIn || null,
      requested_check_out: checkOut || null,
      reason: reason.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Attendance Correction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Check-in */}
          <div>
            <label className="text-sm text-muted-foreground">
              Requested Check In
            </label>
            <Input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="text-sm text-muted-foreground">
              Requested Check Out
            </label>
            <Input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm text-muted-foreground">
              Reason (required)
            </label>
            <Textarea
              placeholder="Explain why this correction is required"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!isValid}>
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
