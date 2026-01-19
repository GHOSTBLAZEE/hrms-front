import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { handleApiError } from "@/lib/handleApiError";

export function useEmployeeStatutory(employeeId) {
  return useQuery({
    queryKey: ["employee-statutory", employeeId],
    enabled: !!employeeId,

    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/statutory`
      );
      return res.data;
    },

    onError: (error) => {
      handleApiError(error, {
        fallback: "Failed to load statutory details",
      });
    },
  });
}

export function useUpdateEmployeeStatutory(employeeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.put(
        `/api/v1/employees/${employeeId}/statutory`,
        payload
      );
      return res.data;
    },

    onSuccess: () => {
      toast.success("Statutory details updated successfully");

      qc.invalidateQueries({
        queryKey: ["employee-statutory", employeeId],
      });
    },

    onError: (error) => {
      handleApiError(error, {
        silent422: true, // RHF handles field-level errors
        fallback: "Failed to update statutory details",
      });
    },
  });
}
