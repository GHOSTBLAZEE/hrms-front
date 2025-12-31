"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export default function PayrollRunsPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["latest-payroll-run"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/reports/payroll-runs");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading…</div>;

  const latestRun = data?.data?.[0];

  if (!latestRun) {
    return (
      <div className="p-6 text-muted-foreground">
        No payroll runs found.
      </div>
    );
  }

  router.replace(`/dashboard/payroll/runs/${latestRun.id}`);
  return null;
}
