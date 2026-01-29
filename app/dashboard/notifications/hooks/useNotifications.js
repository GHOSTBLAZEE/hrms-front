// hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationRealtime } from "./useNotificationRealtime";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient"; // ✅ Import apiClient

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Enable real-time updates
  useNotificationRealtime(user?.id);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 60000, // Fallback polling every 60s
    staleTime: 30000,
  });

  const markAsRead = useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (id) => deleteNotificationById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };
}

// ✅ API functions using apiClient
async function fetchNotifications() {
  const response = await apiClient.get("/api/v1/notifications");
  return response.data;
}

async function markNotificationAsRead(id) {
  const response = await apiClient.patch(`/api/v1/notifications/${id}/read`);
  return response.data;
}

async function markAllNotificationsAsRead() {
  const response = await apiClient.post("/api/v1/notifications/mark-all-read");
  return response.data;
}

async function deleteNotificationById(id) {
  const response = await apiClient.delete(`/api/v1/notifications/${id}`);
  return response.data;
}