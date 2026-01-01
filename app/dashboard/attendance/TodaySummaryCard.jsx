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
  onRequestCorrection,
  canRequestCorrection,
}) {
  const punches = attendance?.logs ?? [];
  const lastPunch = punches[punches.length - 1];

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

      <CardContent className="space-y-3">
        <div className="text-sm">
          Status: <strong>{attendance?.status ?? "Not marked"}</strong>
        </div>

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

        {canRequestCorrection && !isLocked && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onRequestCorrection}
          >
            Request Correction
          </Button>
        )}
        {attendance?.has_pending_correction && (
          <Badge variant="secondary">
            Correction Pending Approval
          </Badge>
        )}


        {lastPunch && (
          <p className="text-xs text-muted-foreground">
            Last punch: <strong>{lastPunch.type}</strong> at{" "}
            {new Date(lastPunch.punch_time).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

