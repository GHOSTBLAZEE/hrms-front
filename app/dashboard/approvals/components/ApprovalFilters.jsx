"use client";

export default function ApprovalFilters({ value, onChange }) {
  const options = [
    { key: "all", label: "All" },
    { key: "leave", label: "Leave" },
    { key: "attendance", label: "Attendance" },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const isActive = value === opt.key;

        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`
              rounded-md border px-3 py-1.5 text-sm transition
              ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:bg-muted"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
