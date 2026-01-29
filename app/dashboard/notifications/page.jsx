"use client";

import { useState, useMemo } from "react";
import { useNotifications } from "./hooks/useNotifications";
import NotificationList from "./components/NotificationList";
import NotificationFilters from "./components/NotificationFilters";
import NotificationSearch from "./components/NotificationSearch";
import { Bell, Check, Filter, Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    isFetching,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    refetch,
  } = useNotifications();

  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const notifications = data?.items ?? [];
  
  // Filter and search logic
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by read status
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read_at);
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.read_at);
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, filter, selectedType, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;
  
  // Get unique notification types for filter
  const notificationTypes = useMemo(() => {
    const types = new Set(notifications.map((n) => n.type).filter(Boolean));
    return Array.from(types);
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          
          {unreadCount > 0 && (
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Mark all as read
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <NotificationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        count={filteredNotifications.length}
      />

      {/* Filters */}
      <NotificationFilters
        filter={filter}
        onFilterChange={setFilter}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        types={notificationTypes}
        counts={{
          all: notifications.length,
          unread: unreadCount,
          read: notifications.length - unreadCount,
        }}
      />

      {/* Notifications List */}
      <NotificationList
        notifications={filteredNotifications}
        onRead={(id) => markAsRead.mutate(id)}
        onDelete={(id) => deleteNotification.mutate(id)}
        isMarkingAsRead={markAsRead.isPending}
        searchQuery={searchQuery}
      />
    </div>
  );
}