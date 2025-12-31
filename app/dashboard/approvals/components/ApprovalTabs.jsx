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
    <div className="flex gap-6 border-b">
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        const count = counts[tab.key];

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              relative pb-2 text-sm transition
              ${
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {tab.label}
            {typeof count === "number" && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({count})
              </span>
            )}

            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
