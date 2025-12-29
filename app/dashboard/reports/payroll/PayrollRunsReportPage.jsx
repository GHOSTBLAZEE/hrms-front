"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import PayrollRunsReportTable from "./components/PayrollRunsReportTable";

export default function PayrollRunsReportPage() {
  const { data, isLoading, error } = useQuery({
  queryKey: ["payroll-runs-report"],
  queryFn: async () => {
    const res = await apiClient.get(
      "/reports/payroll-runs"
    );
    return res.data;
  },
  staleTime: Infinity,
  cacheTime: Infinity,
});


  if (isLoading) return <div>Loading payroll reports…</div>;
  if (error) return <div>Failed to load payroll reports</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Payroll Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Historical payroll runs (finalized & draft)
        </p>
      </header>

      <PayrollRunsReportTable
        runs={data?.data ?? []}
      />
    </div>
  );
}
