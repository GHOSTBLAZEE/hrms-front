"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

export default function TabNavigation({
  tabs,
  employee,
  employeeId,
}) {
  const { permissions } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  /* =========================================================
   | Visible tabs (permission-aware)
   |========================================================= */
  const visibleTabs = useMemo(
    () =>
      tabs.filter((tab) =>
        hasPermission(permissions, tab.permissions)
      ),
    [tabs, permissions]
  );

  /* =========================================================
   | Normalize tab from URL (ONCE)
   |========================================================= */
  const initialTab = useMemo(() => {
    const urlTab = searchParams.get("tab");
    if (!urlTab) return visibleTabs[0]?.key;

    const match = visibleTabs.find(
      (t) => t.key === urlTab
    );

    return match ? match.key : visibleTabs[0]?.key;
  }, [searchParams, visibleTabs]);

  /* =========================================================
   | Active tab state (single source after mount)
   |========================================================= */
  const [active, setActive] = useState(initialTab);

  /* =========================================================
   | Handle tab click (USER INTENT ONLY)
   |========================================================= */
  const handleTabChange = (tabKey) => {
    setActive(tabKey);

    const params = new URLSearchParams(searchParams);
    params.set("tab", tabKey);

    router.replace(
      `/dashboard/employees/${employeeId}?${params.toString()}`,
      { scroll: false }
    );
  };

  /* =========================================================
   | Guard: no accessible tabs
   |========================================================= */
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

  /* =========================================================
   | Render
   |========================================================= */
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {visibleTabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
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
          <ActiveTab
            employee={employee}
            employeeId={employeeId}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            No access
          </div>
        )}
      </div>
    </div>
  );
}
