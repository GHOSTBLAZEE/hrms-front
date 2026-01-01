"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TodayPunchCard from "./TodaySummaryCard";
import PunchTimeline from "./PunchTimeline";
import RequestCorrectionDialog from "./RequestCorrectionDialog";
import ShiftHintBar from "./ShiftHintBar";

export default function AttendancePage() {
  const qc = useQueryClient();
  const [punching, setPunching] = useState(false);
  const [openCorrection, setOpenCorrection] = useState(false);
  /* ---------------------------
   | Load today's attendance
   |----------------------------*/
  const { data: attendance, isLoading } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/attendance/today"
      );
      return res.data;
    },
  });

  const user = qc.getQueryData(["me"]);

  const canRequestCorrection =
  !attendance?.is_locked &&
  !attendance?.has_pending_correction &&
  user?.permissions?.includes("request attendance correction");




  /* ---------------------------
   | Punch mutation (RAW event)
   |----------------------------*/
  const punchMutation = useMutation({
    mutationFn: async (type) => {
      return apiClient.post("/api/v1/attendance/punch", {
        type, // "IN" | "OUT"
        source: "web",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["attendance-today"]);
    },
    onSettled: () => {
      setPunching(false);
    },
  });

  const correctionMutation = useMutation({
    mutationFn: async (payload) => {
      return apiClient.post(
        "/api/v1/attendance-corrections",
        payload
      );
    },
    onSuccess: () => {
      qc.invalidateQueries(["attendance-today"]);
      setOpenCorrection(false);
    },
  });

  const handlePunch = (type) => {
    setPunching(true);
    punchMutation.mutate(type);
  };

  if (isLoading) {
    return <div className="p-6">Loading attendance…</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <TodayPunchCard
        attendance={attendance}
        onPunch={handlePunch}
        loading={punching}
        onRequestCorrection={() => setOpenCorrection(true)}
        canRequestCorrection={canRequestCorrection}
      />


      <RequestCorrectionDialog
        open={openCorrection}
        onClose={() => setOpenCorrection(false)}
        attendance={attendance}
        onSubmit={(payload) =>
          correctionMutation.mutate(payload)
        }
      />

      <ShiftHintBar
        shift={attendance?.shift}
        lastPunch={attendance?.logs?.at(-1)}
      />
      <PunchTimeline punches={attendance?.logs ?? []} />
    </div>
  );
}
