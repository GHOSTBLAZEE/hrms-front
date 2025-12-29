"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import apiClient from "@/lib/apiClient";
import LeaveReportHeader from "./components/LeaveReportHeader";
import LeaveReportTable from "./components/LeaveReportTable";

export default function LeaveReportsPage() {
  const { permissions } = useAuth();

  const canView = hasPermission(
    permissions,
    ["view leave reports"]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["leave-reports"],
    queryFn: async () => {
      const res = await apiClient.get("/reports/leaves");
      return res.data;
    },
    enabled: canView,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (!canView) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You are not authorized to view leave reports.
      </div>
    );
  }

  if (isLoading) return <div className="p-6">Loading leave reports…</div>;
  if (error) return <div className="p-6">Failed to load leave reports</div>;

  return (
    <div className="p-6 space-y-4">
      <LeaveReportHeader />
      <LeaveReportTable data={data?.data ?? []} />
    </div>
  );
}
