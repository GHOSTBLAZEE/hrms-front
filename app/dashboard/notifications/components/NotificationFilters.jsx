"use client";

import { Filter } from "lucide-react";

export default function NotificationFilters({
  filter,
  onFilterChange,
  selectedType,
  onTypeChange,
  types,
  counts,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Read status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === "all"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            }`}
          >
            All <span className="text-muted-foreground">({counts.all})</span>
          </button>
          <button
            onClick={() => onFilterChange("unread")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === "unread"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            }`}
          >
            Unread <span className="text-muted-foreground">({counts.unread})</span>
          </button>
          <button
            onClick={() => onFilterChange("read")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === "read"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            }`}
          >
            Read <span className="text-muted-foreground">({counts.read})</span>
          </button>
        </div>
      </div>

      {/* Type filter */}
      {types.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {formatNotificationType(type)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// Helper function to format notification type
function formatNotificationType(type) {
  return type
    .split(".")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}