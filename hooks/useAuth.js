import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/lib/authApi";
import { hasPermission as checkPermission } from "@/lib/permissions";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
  });

  const permissions = Array.isArray(data?.permissions) ? data.permissions : [];

  const hasPermission = (required = []) =>
    checkPermission(permissions, required);

  return {
    user: data || null,
    permissions,
    hasPermission, // ✅ hook-level helper
    isLoading,
  };
}
