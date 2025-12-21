"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AttendanceLockHeader({
  month,
  setMonth,
  status,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">
          Attendance Lock
        </h1>
        <p className="text-sm text-muted-foreground">
          Freeze attendance for payroll
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <Badge
          variant={status === "locked" ? "destructive" : "secondary"}
        >
          {status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}
