import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import Link from "next/link";

export default function NotificationBadge() {
  const { unreadCount } = useNotifications({
    enablePolling: true,
    pollingInterval: 30000, // Poll every 30 seconds
  });

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-lg hover:bg-accent transition-colors"
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <>
          {/* Animated ping effect for new notifications */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          
          {/* Badge count */}
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </>
      )}
    </Link>
  );
}