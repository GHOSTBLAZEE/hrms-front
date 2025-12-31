"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS = {
  present: "Present",
  absent: "Absent",
  half_day: "Half Day",
  leave: "Leave",
  holiday: "Holiday",
  weekly_off: "Weekly Off",
  missed_punch: "Missed Punch",
};

export default function DayDetailModal({
  open,
  onClose,
  date,
  attendance,
  canRequestCorrection,
  onRequestCorrection,
}) {
  if (!attendance) return null;

  const {
    status,
    check_in,
    check_out,
    worked_minutes,
    is_locked,
    has_correction,
  } = attendance;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {format(new Date(date), "EEEE, dd MMM yyyy")}
          </DialogTitle>
        </DialogHeader>

        {/* Status & Lock */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {STATUS_LABELS[status] ?? status}
          </Badge>

          {is_locked && (
            <Badge variant="destructive">Locked</Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mt-4">
          <DetailRow label="Check In" value={check_in ?? "—"} />
          <DetailRow label="Check Out" value={check_out ?? "—"} />

          <DetailRow
            label="Worked Hours"
            value={
              worked_minutes != null
                ? `${Math.floor(worked_minutes / 60)}h ${
                    worked_minutes % 60
                  }m`
                : "—"
            }
          />
        </div>

        {/* Meta */}
        {has_correction && (
          <div className="text-xs text-amber-600 mt-2">
            Correction already requested for this date
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          {canRequestCorrection && !is_locked && (
            <Button onClick={() => onRequestCorrection(attendance)}>
              Request Correction
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
