import { useQuery } from "@tanstack/react-query"
import { getMeApi } from "@/lib/authApi"

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
  })

  return {
    user: data,
    permissions: data?.permissions || [],
    isLoading,
  }
}
