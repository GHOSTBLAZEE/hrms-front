"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function DayDetailModal({
  open,
  onClose,
  day,
  attendance,
}) {
  if (!day) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{format(day, "PPP")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p>Status: {attendance?.status ?? "No record"}</p>
          <p>Total Hours: {attendance?.total_work_hours ?? 0}</p>

          <div>
            <strong>Punches</strong>
            <ul className="ml-4 list-disc">
              {attendance?.logs?.length ? (
                attendance.logs.map((l) => (
                  <li key={l.id}>
                    {l.type} at{" "}
                    {new Date(l.punch_time).toLocaleTimeString()}
                  </li>
                ))
              ) : (
                <li>No punches</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
