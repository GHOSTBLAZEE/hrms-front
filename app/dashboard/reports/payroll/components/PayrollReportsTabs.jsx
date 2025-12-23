"use client";

import { Button } from "@/components/ui/button";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "department", label: "Department Cost" },
  { id: "statutory", label: "Statutory" },
];

export default function PayrollReportsTabs({
  tab,
  onChange,
}) {
  return (
    <div className="flex gap-2">
      {TABS.map((t) => (
        <Button
          key={t.id}
          variant={tab === t.id ? "default" : "outline"}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
