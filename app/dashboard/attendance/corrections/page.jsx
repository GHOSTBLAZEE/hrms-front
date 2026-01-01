'use client'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import CorrectionsTable from "./CorrectionsTable";
import CorrectionDetailDrawer from "./CorrectionDetailDrawer";

export default function AttendanceCorrectionsPage() {
  const qc = useQueryClient();
  const user = qc.getQueryData(["me"]);

  const [selected, setSelected] = useState(null);

  const { data = [] } = useQuery({
    queryKey: ["attendance-corrections"],
    queryFn: async () =>
      apiClient.get("/api/v1/attendance-corrections").then(r => r.data.data),
  });

  const canApprove =
    selected &&
    selected.status === "pending" &&
    !selected.attendance?.is_locked &&
    selected.employee?.id !== user?.employee_id &&
    user?.permissions?.includes("approve attendance correction");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Attendance Corrections</h1>

      <CorrectionsTable data={data} onSelect={setSelected} />

      <CorrectionDetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        correction={selected}
        canApprove={canApprove}
      />
    </div>
  );
}
