"use client";

import { Button } from "@/components/ui/button";
import { useAttendanceActions } from "@/hooks/attendance/useAttendanceActions";

export default function TodaySummaryCard({ attendance }) {
  const { punch, isPunching } = useAttendanceActions();

  const lastLog = attendance?.logs?.slice(-1)[0];

  return (
    <div className="border rounded p-4 space-y-2">
      <h2 className="font-semibold">Today</h2>

      <p className="text-sm">
        Status: {lastLog?.type || "Not punched"}
      </p>

      <Button onClick={punch} disabled={isPunching}>
        Punch {lastLog?.type === "IN" ? "Out" : "In"}
      </Button>
    </div>
  );
}
