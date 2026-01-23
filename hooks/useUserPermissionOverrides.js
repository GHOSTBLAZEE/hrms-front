import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useUserPermissionOverrides() {
  return useQuery({
    queryKey: ["user-permission-overrides"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/user-permission-overrides"
      );
      return res.data;
    },
  });
}

export function useAddPermissionOverride() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) =>
      apiClient.post(
        "/api/v1/user-permission-overrides",
        payload
      ),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["user-permission-overrides"],
      }),
  });
}
