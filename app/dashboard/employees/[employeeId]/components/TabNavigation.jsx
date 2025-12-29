"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

export default function TabNavigation({ tabs, employee }) {
  const { permissions } = useAuth();
  const [active, setActive] = useState(tabs[0].key);

  const visibleTabs = tabs.filter((tab) =>
    hasPermission(permissions, tab.permissions)
  );

  const ActiveTab = visibleTabs.find(
    (t) => t.key === active
  )?.component;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`pb-2 text-sm ${
              active === tab.key
                ? "border-b-2 border-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {ActiveTab ? (
          <ActiveTab employee={employee} />
        ) : (
          <div className="text-sm text-muted-foreground">
            No access
          </div>
        )}
      </div>
    </div>
  );
}
