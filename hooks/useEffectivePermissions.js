import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useEffectivePermissions(userId) {
  return useQuery({
    queryKey: ["effective-permissions", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/users/${userId}/effective-permissions`
      );
      return res.data;
    },
  });
}
