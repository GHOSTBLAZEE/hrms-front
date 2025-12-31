"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

export default function TabNavigation({ tabs, employee }) {
  const { permissions } = useAuth();

  const visibleTabs = useMemo(
    () =>
      tabs.filter((tab) =>
        hasPermission(permissions, tab.permissions)
      ),
    [tabs, permissions]
  );

  const [active, setActive] = useState(
    visibleTabs[0]?.key
  );

  // Ensure active tab is always valid
  useEffect(() => {
    if (
      !visibleTabs.find((t) => t.key === active)
    ) {
      setActive(visibleTabs[0]?.key);
    }
  }, [visibleTabs, active]);

  if (!visibleTabs.length) {
    return (
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        You don’t have access to view any sections for this employee.
      </div>
    );
  }

  const ActiveTab = visibleTabs.find(
    (t) => t.key === active
  )?.component;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {visibleTabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`
                relative pb-2 text-sm transition
                ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.title}

              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
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
