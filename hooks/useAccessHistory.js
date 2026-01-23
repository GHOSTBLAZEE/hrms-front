import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useAccessHistory(userId) {
  return useQuery({
    queryKey: ["access-history", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/users/${userId}/access-history`
      );
      return res.data;
    },
  });
}
