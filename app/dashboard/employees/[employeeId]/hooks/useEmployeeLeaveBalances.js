import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useEmployeeLeaveBalances(employeeId) {
  return useQuery({
    queryKey: ["employee-leave-balances", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/leave-balances`
      );
      return res.data;
    },
    enabled: !!employeeId,
    staleTime: 60_000,
  });
}
