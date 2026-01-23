import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useUserRoles() {
  return useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/user-roles");
      return res.data;
    },
  });
}

export function useUpdateUserRoles() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleIds }) => {
      return apiClient.put("/api/v1/user-roles", {
        user_id: userId,
        role_ids: roleIds,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-roles"] });
    },
  });
}
