// hooks/useNotificationRealtime.js
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho } from "@/lib/echo"; // ✅ Use your centralized Echo instance
import { toast } from "sonner";

export function useNotificationRealtime(userId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${userId}`);

    channel.listen("NotificationCreated", (event) => {
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

      // Show toast notification
      toast.success(event.notification?.title || "New notification", {
        description: event.notification?.message,
        action: event.notification?.data?.action_url
          ? {
              label: "View",
              onClick: () => {
                window.location.href = event.notification.data.action_url;
              },
            }
          : undefined,
      });

      // Play notification sound (optional)
      if (document.hidden) {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    });

    return () => {
      channel.stopListening("NotificationCreated");
      echo.leave(`user.${userId}`);
    };
  }, [userId, queryClient]);
}