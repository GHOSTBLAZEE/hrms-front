"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function usePayrollRunsReport({ year, month, status }) {
  return useQuery({
    queryKey: ["payroll-runs-report", year, month, status],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/reports/payroll-runs",
        {
          params: {
            year,
            month,
            status,
          },
        }
      );

      return res.data;
    },
    staleTime: Infinity,   // payroll snapshot
    cacheTime: Infinity,
  });
}
