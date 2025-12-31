import EmptyNotifications from "./EmptyNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onRead }) {
  if (!notifications.length) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-1">
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          n={n}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
