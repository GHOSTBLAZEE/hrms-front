import { useQuery } from "@tanstack/react-query";

export function useAttendanceMonthlyReport({ month, year }) {
  return useQuery({
    queryKey: ["attendance-monthly-report", year, month],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/reports/attendance/monthly", {
        params: { year, month },
      });
      return res.data;
    },
    enabled: !!year && !!month,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
