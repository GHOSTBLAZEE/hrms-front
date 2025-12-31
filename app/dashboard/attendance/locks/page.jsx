"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AttendanceLockHeader from "./AttendanceLockHeader";
import LockSummaryCard from "./LockSummaryCard";
import LockActionPanel from "./LockActionPanel";
import LockHistoryTable from "./LockHistoryTable";

export default function AttendanceLockPage() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data: lockData } = useQuery({
    queryKey: ["attendance-lock", month],
    queryFn: () =>
      fetch(`/api/v1/attendance-locks/${month}`, {
        credentials: "include",
      }).then((r) => r.json()),
  });

    const lockMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/v1/attendance-locks/${month}/lock`, {
        method: "POST",
        credentials: "include",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance-lock", month]);
    },
  });


  return (
    <div className="p-6 space-y-6">
      <AttendanceLockHeader
        month={month}
        setMonth={setMonth}
        status={lockData?.status ?? "open"}
      />

      <LockSummaryCard summary={lockData?.summary ?? {}} />

      <LockActionPanel
        status={lockData?.status}
        canLock={lockData?.can_lock}
        onLock={lockMutation.mutate}
      />
      
      <LockHistoryTable history={lockData?.history ?? []} />
    </div>
  );
}
