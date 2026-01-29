import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovalDetails(approvalId, open) {
  return useQuery({
    queryKey: ["approval", approvalId],
    enabled: !!approvalId && open,
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/v1/approvals/${approvalId}`
      );
      return data;
    },
  });
}
