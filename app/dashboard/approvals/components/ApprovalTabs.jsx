"use client";

import clsx from "clsx";

export default function ApprovalTabs({
  value,
  onChange,
  counts = {},
}) {
  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div
      className="flex gap-6 border-b"
      role="tablist"
      aria-label="Approval status tabs"
    >
      {tabs.map(({ key, label }) => {
        const isActive = value === key;
        const count = counts[key];

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={clsx(
              "relative pb-2 text-sm transition focus:outline-none",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-1">
              {label}

              {Number.isInteger(count) && (
                <span className="text-xs text-muted-foreground">
                  ({count})
                </span>
              )}
            </span>

            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
