"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PayrollRunHeader from "./PayrollRunHeader";
import AttendanceSnapshotTable from "./AttendanceSnapshotTable";
import RunPayrollPanel from "./RunPayrollPanel";

export default function PayrollRunsPage() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data: runData } = useQuery({
    queryKey: ["payroll-run", month],
    queryFn: () =>
      fetch(`/api/v1/payroll/runs/${month}`, {
        credentials: "include",
      }).then((r) => r.json()),
  });

  const finalizeMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/v1/payroll/runs/${month}/finalize`, {
        method: "POST",
        credentials: "include",
      }),
  });

  return (
    <div className="p-6 space-y-6">
      <PayrollRunHeader
        month={month}
        setMonth={setMonth}
        status={runData?.status}
      />

      <AttendanceSnapshotTable
        data={runData?.snapshot ?? []}
      />

      <RunPayrollPanel
        canRun={runData?.can_finalize}
        status={runData?.status}
        onRun={finalizeMutation.mutate}
      />
    </div>
  );
}
