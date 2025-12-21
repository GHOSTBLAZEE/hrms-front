"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TodaySummaryCard({
  attendance,
  onPunch,
  loading,
}) {
  const logs = attendance?.logs ?? [];
  const lastLog = logs[logs.length - 1];
  const nextAction =
    !lastLog || lastLog.type === "OUT" ? "IN" : "OUT";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm">
          Status:{" "}
          <strong>{attendance?.status ?? "Not marked"}</strong>
        </div>

        <Button
          onClick={onPunch}
          disabled={loading}
          className="w-full"
        >
          {loading
            ? "Processing..."
            : nextAction === "IN"
            ? "Check In"
            : "Check Out"}
        </Button>

        {lastLog && (
          <p className="text-xs text-muted-foreground">
            Last punch: {lastLog.type} at{" "}
            {new Date(lastLog.punch_time).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
