"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import PayrollRunsReportTable from "./components/PayrollRunsReportTable";

export default function PayrollRunsReportPage() {
  const [status, setStatus] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["payroll-runs-report", status],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/reports/payroll-runs",
        {
          params:
            status === "all"
              ? {}
              : { status },
        }
      );
      return res.data;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading payroll reports…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Failed to load payroll reports
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">
          Payroll Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Payroll runs generated from locked attendance
          and snapshotted salary structures.
        </p>
      </header>

      {/* Trust notice */}
      <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        Finalized payroll runs are immutable and
        audit-verified. Draft runs are shown for
        reference only.
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Status:
        </span>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="all">
            All
          </option>
          <option value="finalized">
            Finalized
          </option>
          <option value="draft">
            Draft
          </option>
          <option value="reverted">
            Reverted
          </option>
        </select>
      </div>

      {/* Table */}
      <PayrollRunsReportTable
        runs={data?.data ?? []}
      />
    </div>
  );
}
