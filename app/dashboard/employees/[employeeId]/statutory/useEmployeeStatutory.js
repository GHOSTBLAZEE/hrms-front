import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useEmployeeStatutory(employeeId) {
  return useQuery({
    queryKey: ["employee-statutory", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/statutory`
      );
      return res.data;
    },
  });
}

export function useUpdateEmployeeStatutory(employeeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return apiClient.put(
        `/api/v1/employees/${employeeId}/statutory`,
        payload
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employee-statutory", employeeId],
      });
    },
  });
}
