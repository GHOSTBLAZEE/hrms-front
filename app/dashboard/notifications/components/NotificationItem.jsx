import { useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  ExternalLink,
  MoreVertical,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({
  notification: n,
  onRead,
  onDelete,
  isMarkingAsRead,
  index,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const unread = n.is_unread;

  const handleRead = async (e) => {
    e.stopPropagation();
    if (unread) {
      await onRead(n.id);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(n.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (unread) {
      onRead(n.id);
    }
    if (n.action_url) {
      window.location.href = n.action_url;
    }
  };

  // Get notification icon and color based on category
  const getNotificationStyle = () => {
    const category = n.category || 'general';
    
    const styles = {
      leave: {
        icon: Calendar,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      attendance: {
        icon: Clock,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
      payroll: {
        icon: DollarSign,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
      },
      employee: {
        icon: Users,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      },
      document: {
        icon: FileText,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
      },
      general: {
        icon: Bell,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
      },
    };

    return styles[category] || styles.general;
  };

  const style = getNotificationStyle();
  const Icon = style.icon;

  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(n.created_at), {
    addSuffix: true,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      className={`
        group relative rounded-lg border px-4 py-3.5 transition-all duration-200
        ${isDeleting ? "opacity-50 scale-95" : ""}
        ${
          unread
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            : "bg-card hover:bg-accent/50 border-border"
        }
        ${n.action_url ? "cursor-pointer" : ""}
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        animate-in fade-in slide-in-from-top-2
      `}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${unread ? "Unread" : "Read"} notification: ${n.title}`}
    >
      <div className="flex gap-3">
        {/* Icon or Unread Indicator */}
        <div className="pt-0.5 flex-shrink-0">
          {unread ? (
            <div className="relative">
              <div className={`p-2 rounded-full ${style.bgColor}`}>
                <Icon className={`h-4 w-4 ${style.color}`} />
              </div>
              <span className="absolute -top-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
            </div>
          ) : (
            <div className={`p-2 rounded-full ${style.bgColor}`}>
              <Icon className={`h-4 w-4 ${style.color}`} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-snug ${
                  unread ? "font-semibold text-foreground" : "font-medium text-foreground/90"
                }`}
              >
                {n.title}
              </p>
              
              {/* Show actor name if available */}
              {n.actor && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  by {n.actor.name}
                </p>
              )}

              {/* Category badge */}
              {n.category && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground capitalize">
                  {n.category.replace(/_/g, " ")}
                </span>
              )}
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Notification actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                    />
                    <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border bg-popover shadow-lg animate-in fade-in slide-in-from-top-2">
                      {unread && (
                        <button
                          onClick={handleRead}
                          disabled={isMarkingAsRead}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors rounded-t-lg disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-b-lg disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {n.message}
          </p>

          {n.action_url && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium pt-1">
              <span>View details</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}