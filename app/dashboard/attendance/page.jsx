"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TodayPunchCard from "./TodaySummaryCard";
import PunchTimeline from "./PunchTimeline";

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
      />

      <RequestCorrectionDialog
        open={openCorrection}
        onClose={() => setOpenCorrection(false)}
        attendance={attendance}
      />

      <ShiftHintBar
        shift={attendance?.shift}
        lastPunch={attendance?.logs?.at(-1)}
      />
      <PunchTimeline punches={attendance?.logs ?? []} />
    </div>
  );
}
