"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";

import AttendanceLockHeader from "./AttendanceLockHeader";
import LockSummaryCard from "./LockSummaryCard";
import LockActionPanel from "./LockActionPanel";
import LockHistoryTable from "./LockHistoryTable";

const DEFAULT_LOCK = {
  status: "unlocked",
  can_lock: false,
  can_unlock: false,
  payroll_finalized: false,
  summary: {},
  history: [],
};

export default function AttendanceLockPage() {
  const queryClient = useQueryClient();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [year, m] = month.split("-");
  const yearNum = Number(year);
  const monthNum = Number(m);

  /* ------------------------------------------------------------
   | Fetch lock state (single source of truth)
   |------------------------------------------------------------ */
  const {
    data: lockData,
    isLoading,
  } = useQuery({
    queryKey: ["attendance-lock", month],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/attendance-locks/${month}`
      );
      return res.data;
    },
    staleTime: 30_000,
  });

  const lock = lockData ?? DEFAULT_LOCK;

  /* ------------------------------------------------------------
   | Lock attendance
   |------------------------------------------------------------ */
  const lockMutation = useMutation({
    mutationFn: () =>
      apiClient.post(
        `/api/v1/attendance-locks/${month}/lock`
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["attendance-lock", month],
      }),
  });

  /* ------------------------------------------------------------
   | Request unlock (dual approval)
   |------------------------------------------------------------ */
  const requestUnlockMutation = useMutation({
    mutationFn: (reason) =>
      apiClient.post(
        `/api/v1/attendance-unlock-requests`,
        {
          year: yearNum,
          month: monthNum,
          reason,
        }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["attendance-lock", month],
      }),
  });

  /* ------------------------------------------------------------
   | Loading
   |------------------------------------------------------------ */
  if (isLoading) {
    return <div className="p-6">Loading attendance lock…</div>;
  }

  /* ------------------------------------------------------------
   | Render
   |------------------------------------------------------------ */
  return (
    <div className="p-6 space-y-6">
      <AttendanceLockHeader
        month={month}
        setMonth={setMonth}
        status={lock.status}
      />

      <LockSummaryCard summary={lock.summary} />

      <LockActionPanel
        status={lock.status}
        canLock={lock.can_lock}
        canUnlock={lock.can_unlock}
        payrollFinalized={lock.payroll_finalized}
        onLock={() => lockMutation.mutate()}
        onRequestUnlock={() =>
          requestUnlockMutation.mutate(
            "Attendance correction required after payroll review"
          )
        }
      />

      {/* 🔄 Recalculation button will go HERE later */}

      <LockHistoryTable history={lock.history} />
    </div>
  );
}
