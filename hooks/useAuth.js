import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useAuth() {
  const {
    data,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await apiClient.get("/me");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  return {
    user: isFetched ? data?.user ?? null : null,
    permissions: isFetched ? data?.permissions ?? [] : [],
    isLoading,
    isFetched,
  };
}
