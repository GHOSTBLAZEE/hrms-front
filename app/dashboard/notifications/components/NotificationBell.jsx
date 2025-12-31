"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const router = useRouter();
  const { data } = useNotifications();

  const unread =
    Array.isArray(data?.items)
      ? data.items.filter((n) => !n.read_at).length
      : 0;

  return (
    <button
      onClick={() => router.push("/dashboard/notifications")}
      className="relative"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[11px] rounded-full">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}
