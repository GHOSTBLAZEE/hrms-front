import { Bell, SearchX, Inbox } from "lucide-react";

export default function EmptyNotifications({ hasSearchQuery, searchQuery }) {
  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          We couldn't find any notifications matching{" "}
          <span className="font-medium text-foreground">"{searchQuery}"</span>.
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <Inbox className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">You're all caught up!</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No notifications to show right now. We'll notify you when something
        important happens.
      </p>
    </div>
  );
}