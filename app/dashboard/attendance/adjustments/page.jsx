"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import AdjustmentPreviewTable from "./AdjustmentPreviewTable";
import ApplyAdjustmentsPanel from "./ApplyAdjustmentsPanel";

export default function AttendanceAdjustmentsPage() {
  const { data = [] } = useQuery({
    queryKey: ["attendance-adjustments-preview"],
    queryFn: () =>
      fetch("/api/v1/attendance-adjustments/preview", {
        credentials: "include",
      }).then((r) => r.json()),
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      fetch("/api/v1/attendance-adjustments/apply", {
        method: "POST",
        credentials: "include",
      }),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Attendance Adjustments
      </h1>

      <AdjustmentPreviewTable data={data} />

      <ApplyAdjustmentsPanel
        canApply={true}
        pendingCount={data.length}
        onApply={applyMutation.mutate}
      />
    </div>
  );
}
