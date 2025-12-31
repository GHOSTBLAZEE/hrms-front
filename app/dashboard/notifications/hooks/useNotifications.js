import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useNotifications() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications");
      return {
        items: res.data.data,
        meta: res.data.meta,
      };
    },
    staleTime: 30_000,
  });

  const markAsRead = useMutation({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/v1/notifications/read-all`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  return {
    ...query,
    markAsRead,
    markAllAsRead,
  };
}
