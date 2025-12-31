"use client";

import { useNotifications } from "./hooks/useNotifications";
import NotificationList from "./components/NotificationList";

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    markAllAsRead,
    markAsRead,
  } = useNotifications();
console.log(data);

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (isLoading) return <div>Loading notifications…</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>

        {unreadCount > 0 && (
          <button
            className="text-sm underline"
            onClick={() => markAllAsRead.mutate()}
          >
            Mark all as read
          </button>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        onRead={markAsRead.mutate}
      />
    </div>
  );
}
