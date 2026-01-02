import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Payroll-safe monthly attendance
 * Source of truth: /reports/attendance/monthly
 */
export function useAttendanceMonth({ year, month, enabled = true }) {
  return useQuery({
    queryKey: ["attendance-report-monthly", year, month],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/reports/attendance/monthly",
        {
          params: { year, month },
        }
      );

      /**
       * Expected backend shape:
       * {
       *   data: Attendance[],
       *   meta: { locked, totals, etc }
       * }
       */
      return data;
    },
    enabled: Boolean(year && month && enabled),
    staleTime: Infinity,   // immutable after lock
    cacheTime: Infinity,
  });
}
