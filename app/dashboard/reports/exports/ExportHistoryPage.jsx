"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import ExportHistoryTable from "./components/ExportHistoryTable";

async function fetchExports() {
  const res = await apiClient.get("/api/v1/exports");
  return res.data;
}

export default function ExportHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["export-history"],
    queryFn: fetchExports,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Export History</h1>
        <p className="text-sm text-muted-foreground">
          All generated exports (audit, payroll, attendance)
        </p>
      </header>

      <ExportHistoryTable
        exports={data?.data || []}
        loading={isLoading}
      />
    </div>
  );
}
