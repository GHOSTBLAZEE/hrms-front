import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export function useNotifications(options = {}) {
  const { enablePolling = false, pollingInterval = 30000 } = options;
  const qc = useQueryClient();

  // Main notifications query
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
    refetchInterval: enablePolling ? pollingInterval : false,
    retry: 2,
  });

  // Unread count query (cached separately for header badge)
  const unreadQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications/unread-count");
      return res.data.count;
    },
    staleTime: 30_000,
    refetchInterval: enablePolling ? pollingInterval : false,
  });

  // Get notification types for filtering
  const typesQuery = useQuery({
    queryKey: ["notifications", "types"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications/types");
      return res.data;
    },
    staleTime: 300_000, // 5 minutes
  });

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.post(`/api/v1/notifications/${id}/read`);
      return res.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previousData = qc.getQueryData(["notifications"]);

      // Optimistically update
      qc.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === id ? { ...item, read_at: new Date().toISOString(), is_unread: false } : item
          ),
        };
      });

      // Update unread count
      qc.setQueryData(["notifications", "unread-count"], (old) => 
        old ? Math.max(0, old - 1) : 0
      );

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        qc.setQueryData(["notifications"], context.previousData);
      }
      toast.error("Failed to mark notification as read");
      console.error("Mark as read error:", err);
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/api/v1/notifications/mark-all-read");
      return res.data;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previousData = qc.getQueryData(["notifications"]);

      qc.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) => ({
            ...item,
            read_at: item.read_at || new Date().toISOString(),
            is_unread: false,
          })),
        };
      });

      qc.setQueryData(["notifications", "unread-count"], 0);

      return { previousData };
    },
    onError: (err, _, context) => {
      if (context?.previousData) {
        qc.setQueryData(["notifications"], context.previousData);
      }
      toast.error("Failed to mark all notifications as read");
      console.error("Mark all as read error:", err);
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/api/v1/notifications/${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previousData = qc.getQueryData(["notifications"]);

      const deletedItem = previousData?.items.find(item => item.id === id);
      
      qc.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== id),
        };
      });

      // Update unread count if deleted notification was unread
      if (deletedItem && deletedItem.is_unread) {
        qc.setQueryData(["notifications", "unread-count"], (old) => 
          old ? Math.max(0, old - 1) : 0
        );
      }

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        qc.setQueryData(["notifications"], context.previousData);
      }
      toast.error("Failed to delete notification");
      console.error("Delete notification error:", err);
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // Clear all read notifications
  const clearAllRead = useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete("/api/v1/notifications/clear-read");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Read notifications cleared");
    },
    onError: (err) => {
      toast.error("Failed to clear notifications");
      console.error("Clear notifications error:", err);
    },
  });

  return {
    ...query,
    unreadCount: unreadQuery.data ?? 0,
    notificationTypes: typesQuery.data ?? [],
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
  };
}