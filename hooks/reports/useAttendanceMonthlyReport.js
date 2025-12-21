"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useAttendanceMonthlyReport(year, month) {
  return useQuery({
    queryKey: ["attendance-report", year, month],
    queryFn: async () => {
      return await apiClient.get(
        `/reports/attendance/monthly?year=${year}&month=${month}`
      );
    },
    enabled: !!year && !!month,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
