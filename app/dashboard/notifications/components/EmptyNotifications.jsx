export default function EmptyNotifications() {
  return (
    <div className="rounded-md border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">
        You’re all caught up 🎉
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        No new notifications right now
      </p>
    </div>
  );
}
