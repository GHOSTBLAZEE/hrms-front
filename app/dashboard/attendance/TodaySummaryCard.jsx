"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TodayPunchCard({
  attendance,
  onPunch,
  loading,
}) {
  const punches = attendance?.logs ?? [];
  const lastPunch = punches[punches.length - 1];

  // Determine next raw action (UI hint only)
  const nextAction =
    !lastPunch || lastPunch.type === "OUT"
      ? "IN"
      : "OUT";

  const isLocked = attendance?.is_locked;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today</CardTitle>

        {isLocked && (
          <Badge variant="destructive">Locked</Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Derived status (read-only) */}
        <div className="text-sm">
          Status:{" "}
          <strong>
            {attendance?.status ?? "Not marked"}
          </strong>
        </div>

        {/* Punch action */}
        <Button
          className="w-full"
          disabled={loading || isLocked}
          onClick={() => onPunch(nextAction)}
        >
          {loading
            ? "Processing…"
            : nextAction === "IN"
            ? "Punch In"
            : "Punch Out"}
        </Button>

        {/* Last punch info */}
        {lastPunch && (
          <p className="text-xs text-muted-foreground">
            Last punch:{" "}
            <strong>{lastPunch.type}</strong> at{" "}
            {new Date(
              lastPunch.punch_time
            ).toLocaleTimeString()}
          </p>
        )}

        {/* Missed punch hint (UI only) */}
        {attendance?.status === "missed_punch" && (
          <p className="text-xs text-amber-600">
            ⚠ Missed punch detected. Please request a
            correction if required.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
