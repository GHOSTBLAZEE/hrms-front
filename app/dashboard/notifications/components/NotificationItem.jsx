export default function NotificationItem({ n, onRead }) {
  const unread = !n.read_at;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`
        rounded-md border px-4 py-3 transition
        ${unread
          ? "bg-muted/50 hover:bg-muted"
          : "hover:bg-muted/30"}
      `}
      onClick={() => unread && onRead(n.id)}
    >
      <div className="flex gap-3">
        {/* Unread indicator */}
        <div className="pt-1">
          {unread ? (
            <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
          ) : (
            <span className="block h-2.5 w-2.5 rounded-full bg-transparent" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <p className={`text-sm ${unread ? "font-medium" : ""}`}>
              {n.title}
            </p>

            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(n.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-snug">
            {n.message}
          </p>
        </div>
      </div>
    </div>
  );
}
