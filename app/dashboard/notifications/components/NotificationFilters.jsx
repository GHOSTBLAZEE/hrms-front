import { Check } from "lucide-react";

export default function NotificationFilters({
  filter,
  onFilterChange,
  selectedType,
  onTypeChange,
  types,
  counts,
}) {
  const statusFilters = [
    { value: "all", label: "All", count: counts.all },
    { value: "unread", label: "Unread", count: counts.unread },
    { value: "read", label: "Read", count: counts.read },
  ];

  return (
    <div className="space-y-3">
      {/* Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusFilters.map((item) => (
          <button
            key={item.value}
            onClick={() => onFilterChange(item.value)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${
                filter === item.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }
            `}
          >
            {item.label}
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${
                  filter === item.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-muted-foreground"
                }
              `}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Type Filters */}
      {types.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Type:</span>
          <button
            onClick={() => onTypeChange("all")}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${
                selectedType === "all"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }
            `}
          >
            {selectedType === "all" && <Check className="h-3 w-3" />}
            All Types
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize
                ${
                  selectedType === type
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }
              `}
            >
              {selectedType === type && <Check className="h-3 w-3" />}
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}