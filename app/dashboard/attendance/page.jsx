"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TodayPunchCard from "./TodaySummaryCard";
import PunchTimeline from "./PunchTimeline";
import RequestCorrectionDialog from "./RequestCorrectionDialog";
import ShiftHintBar from "./ShiftHintBar";
import { toast } from "sonner";
import { AlertCircle, Calendar, Clock, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
  const qc = useQueryClient();
  const [punching, setPunching] = useState(false);
  const [openCorrection, setOpenCorrection] = useState(false);

  /* ---------------------------
   | Load today's attendance
   |----------------------------*/
  const {
    data: attendance,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/attendance/today");
      return res.data;
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const user = qc.getQueryData(["me"]);

  const canRequestCorrection =
    !attendance?.is_locked &&
    !attendance?.has_pending_correction &&
    !!attendance?.id;

  /* ---------------------------
   | Punch mutation
   |----------------------------*/
  const punchMutation = useMutation({
    mutationFn: () => apiClient.post("/api/v1/attendance/punch"),
    onMutate: () => setPunching(true),
    onSettled: () => setPunching(false),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance-today"] });
      toast.success("Punch recorded");
    },
    onError: () => {
      toast.error("Failed to record punch. Please try again.");
    },
  });

  /* ---------------------------
   | Loading state
   |----------------------------*/
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  /* ---------------------------
   | Error state
   |----------------------------*/
  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load attendance data.{" "}
            <button
              onClick={() => refetch()}
              className="underline font-medium"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /* ---------------------------
   | Render
   |----------------------------*/
  return (
    <div className="p-6 space-y-4">
      {attendance?.is_locked && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This month's attendance is locked and cannot be modified.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <ShiftHintBar employeeId={user?.user?.employee_id} />

      <TodayPunchCard
        attendance={attendance}
        onPunch={() => punchMutation.mutate()}
        isPunching={punching || punchMutation.isPending}
        canRequestCorrection={canRequestCorrection}
        onRequestCorrection={() => setOpenCorrection(true)}
      />

      <PunchTimeline logs={attendance?.logs ?? []} />

      <RequestCorrectionDialog
        open={openCorrection}
        onOpenChange={setOpenCorrection}
        attendance={attendance}
      />
    </div>
  );
}