import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovals({ status = "pending", type = "leave" }) {
  return useQuery({
    queryKey: ["approvals", type, status],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/${type}s/approvals`,
        { params: { status } }
      );
      return res.data;
    },
  });
}
