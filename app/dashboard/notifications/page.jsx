"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "./hooks/useNotifications";
import NotificationList from "./components/NotificationList";
import NotificationFilters from "./components/NotificationFilters";
import NotificationSearch from "./components/NotificationSearch";
import { Bell, Check, Loader2, RefreshCw } from "lucide-react";
import { debounce } from "@/lib/utils";
import { toast } from "sonner"; // or your toast library

export default function NotificationsPage() {
  const queryClient = useQueryClient();
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
  const [searchQueryInternal, setSearchQueryInternal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  // Pull to refresh state
  const [pullStart, setPullStart] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Filter and search logic
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

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

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query) ||
          n.type?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, filter, selectedType, searchQuery]);

  // Get unique notification types for filter
  const notificationTypes = useMemo(() => {
    const types = new Set(notifications.map((n) => n.type).filter(Boolean));
    return Array.from(types);
  }, [notifications]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (value) => {
    setSearchQueryInternal(value);
    debouncedSearch(value);
  };

  // Mark all as read with optimistic updates
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    const previousData = data;

    // Optimistic UI update
    queryClient.setQueryData(["notifications"], (old) => ({
      ...old,
      items: old?.items?.map((n) => ({
        ...n,
        read_at: n.read_at || new Date().toISOString(),
      })),
    }));

    try {
      await markAllAsRead.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(["notifications"], previousData);
      toast.error("Failed to mark notifications as read");
      console.error("Failed to mark all as read:", error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + A = Mark all as read
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        if (unreadCount > 0) {
          handleMarkAllAsRead();
        }
      }

      // Ctrl/Cmd + F = Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.querySelector('[role="searchbox"]')?.focus();
      }

      // R = Refresh
      if (e.key === "r" && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          refetch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [unreadCount, refetch]);

  // Pull to refresh for mobile
  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY > 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0) {
          setIsPulling(true);
          setPullStart(Math.min(diff, 100));
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullStart > 60) {
        refetch();
        toast.success("Refreshing notifications...");
      }
      setIsPulling(false);
      setPullStart(0);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullStart, refetch]);

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
console.log(data);

  return (
    <div className="max-w-4xl  p-4 sm:p-6 space-y-6">
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 flex items-center justify-center z-50 transition-transform"
          style={{ transform: `translateY(${pullStart}px)` }}
        >
          <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <RefreshCw
              className={`h-5 w-5 text-primary ${
                pullStart > 60 ? "animate-spin" : ""
              }`}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
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
          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh notifications (R)"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              title="Mark all as read (Ctrl/Cmd + A)"
            >
              {markAllAsRead.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Marking...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <NotificationSearch
        value={searchQueryInternal}
        onChange={handleSearchChange}
        count={filteredNotifications.length}
        totalCount={notifications.length}
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
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          {searchQuery ? (
            <>
              <p className="text-muted-foreground">
                No notifications match "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchQueryInternal("");
                }}
                className="text-primary hover:underline text-sm font-medium"
              >
                Clear search
              </button>
            </>
          ) : filter === "unread" ? (
            <>
              <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">No unread notifications</p>
            </>
          ) : selectedType !== "all" ? (
            <>
              <p className="text-muted-foreground">
                No notifications of this type
              </p>
              <button
                onClick={() => setSelectedType("all")}
                className="text-primary hover:underline text-sm font-medium"
              >
                View all notifications
              </button>
            </>
          ) : (
            <>
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You'll see notifications here when you have them
              </p>
            </>
          )}
        </div>
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          onRead={(id) => markAsRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
          isMarkingAsRead={markAsRead.isPending}
          searchQuery={searchQuery}
        />
      )}

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t space-y-1">
        <p className="font-medium">Keyboard Shortcuts:</p>
        <p>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl/⌘ A</kbd> Mark all as read •{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl/⌘ F</kbd> Search •{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">R</kbd> Refresh
        </p>
      </div>
    </div>
  );
}