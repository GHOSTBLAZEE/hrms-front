"use client";

import { Search, X } from "lucide-react";

export default function NotificationSearch({ value, onChange, count, totalCount }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        role="searchbox"
        placeholder="Search notifications..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-20 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {count} / {totalCount}
          </span>
          <button
            onClick={() => onChange("")}
            className="p-1 hover:bg-accent rounded-md transition-colors"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}