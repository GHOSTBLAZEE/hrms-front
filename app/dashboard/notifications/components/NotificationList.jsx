import EmptyNotifications from "./EmptyNotifications";
import NotificationItem from "./NotificationItem";
import { AlertCircle } from "lucide-react";

export default function NotificationList({
  notifications,
  onRead,
  onDelete,
  isMarkingAsRead,
  searchQuery,
}) {
  if (!notifications.length) {
    return (
      <EmptyNotifications
        hasSearchQuery={!!searchQuery}
        searchQuery={searchQuery}
      />
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n, index) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onRead={onRead}
          onDelete={onDelete}
          isMarkingAsRead={isMarkingAsRead}
          index={index}
        />
      ))}
    </div>
  );
}