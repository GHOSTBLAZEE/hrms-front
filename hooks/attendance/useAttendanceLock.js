import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Attendance lock status for a given month
 * Source of truth: AttendanceLock table
 */
export function useAttendanceLock({ year, month, enabled = true }) {
  return useQuery({
    queryKey: ["attendance-lock", year, month],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/attendance/locks",
        {
          params: { year, month },
        }
      );

      /**
       * Expected response:
       * {
       *   locked: boolean,
       *   locked_by: { id, name } | null,
       *   locked_at: string | null,
       *   reason?: string
       * }
       */
      return data;
    },
    enabled: Boolean(year && month && enabled),
    staleTime: Infinity,   // lock is immutable once set
    cacheTime: Infinity,
  });
}
