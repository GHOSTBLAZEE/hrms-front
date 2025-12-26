import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get("/me");
      return res.data;
    },
    retry: false,
  });

  return {
    user: data,
    permissions: data?.permissions ?? [],
    isLoading,
  };
}
