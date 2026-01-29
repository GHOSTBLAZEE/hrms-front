"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function RejectApprovalDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Reject Request",
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }

    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    setError("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Please provide a clear reason for rejecting this request. This will be
            visible to the requester.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="reason">
            Rejection Reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="reason"
            placeholder="Explain why this request is being rejected..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            rows={4}
            disabled={isLoading}
            className={error ? "border-destructive" : ""}
          />
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {reason.length}/500 characters • Press ⌘+Enter to submit
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? "Rejecting..." : "Reject Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}