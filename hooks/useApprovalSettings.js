import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// useApprovalSettings.js
export function useApprovalSettings() {
  return useQuery({
    queryKey: ["approval-settings"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/company/approval-settings"
      );
      return res.data;
    },
  });
}

export function useUpdateApprovalSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.put(
        "/api/v1/company/approval-settings",
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approval-settings"] });
    },
  });
}

