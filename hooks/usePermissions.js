import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions-matrix"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/permissions");
      return res.data;
    },
  });
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissions }) => {
      return apiClient.put("/api/v1/permissions", {
        role_id: roleId,
        permissions,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions-matrix"] });
    },
  });
}
