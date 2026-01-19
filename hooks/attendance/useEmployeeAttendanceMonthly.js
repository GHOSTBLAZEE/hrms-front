import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export function useEmployeeAttendanceMonthly({
  employeeId,
  year,
  month,
}) {
  return useQuery({
    queryKey: [
      "employee-attendance",
      employeeId,
      year,
      month,
    ],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/attendance/monthly`,
        { params: { year, month } }
      );
      console.log(res);
      
      return res.data;
    },
    enabled: !!employeeId && !!year && !!month,
  });
}
