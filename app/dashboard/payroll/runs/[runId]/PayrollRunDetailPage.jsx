"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import PayrollRunSummary from "./components/PayrollRunSummary";
import PayrollEmployeeTable from "./components/PayrollEmployeeTable";
import PayrollTotalsFooter from "./components/PayrollTotalsFooter";

async function fetchPayrollRun(runId) {
  const res = await apiClient.get(`/payroll-runs/${runId}`);

  return res.data;
}

export default function PayrollRunDetailPage({ runId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-run", runId],
    queryFn: () => fetchPayrollRun(runId),
  });

  if (isLoading) return <div>Loading payroll run…</div>;

  const { run, employees, totals } = data;

  return (
    <div className="space-y-6">
      <PayrollRunSummary run={run} />
      <PayrollEmployeeTable employees={employees} />
      <PayrollTotalsFooter totals={totals} />
    </div>
  );
}
