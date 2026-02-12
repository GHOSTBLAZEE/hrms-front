import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { QUERY_CONFIGS } from "@/config/queryConfig";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/me");
      return res.data;
    },
    retry: false,
    ...QUERY_CONFIGS.USER_SESSION,
  });

  return {
    user: data?.user ?? null,
    permissions: data?.permissions ?? [],
    isLoading,
  };
}
