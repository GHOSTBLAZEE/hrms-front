import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export function useEmployeeAttendanceTrend(employeeId) {
  return useQuery({
    queryKey: ["employee-attendance-trend", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/attendance/trend`
      );
      return res.data;
    },
    enabled: !!employeeId,
    staleTime: 60_000,
  });
}