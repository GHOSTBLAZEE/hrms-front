"use client";

import { Badge } from "@/components/ui/badge";

export default function ShiftHintBar({ shift, lastPunch }) {
  if (!shift) return null;

  const now = new Date();
  const [sh, sm] = shift.start.split(":").map(Number);
  const [eh, em] = shift.end.split(":").map(Number);

  const shiftStart = new Date();
  shiftStart.setHours(sh, sm, 0, 0);

  const shiftEnd = new Date();
  shiftEnd.setHours(eh, em, 0, 0);

  let hint = "Within shift window";
  let variant = "secondary";

  if (now < shiftStart) {
    hint = "Early for shift";
  } else if (
    now >
    new Date(
      shiftStart.getTime() +
        (shift.grace_minutes ?? 0) * 60000
    )
  ) {
    hint = "Late for shift";
    variant = "destructive";
  }

  return (
    <div className="flex items-center justify-between text-sm border rounded px-3 py-2">
      <div>
        Shift:{" "}
        <strong>
          {shift.name} ({shift.start}–{shift.end})
        </strong>
      </div>

      <Badge variant={variant}>{hint}</Badge>
    </div>
  );
}
