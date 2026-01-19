import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useLeaveTypes() {
  return useQuery({
    queryKey: ["leave-types"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leave-types");
      return res.data;
    },
    staleTime: Infinity,
  });
}
