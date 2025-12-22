"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import { useAuth } from "@/hooks/useAuth";
import { routePermissions } from "@/config/route-permissions";

export default function DashboardLayout({ children }) {
  const { permissions = [], isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  /* ================= ROUTE GUARD ================= */

  useEffect(() => {
    if (isLoading) return;

    const rule = routePermissions.find((r) =>
      pathname.startsWith(r.path)
    );

    // No rule → allowed
    if (!rule) return;

    const allowed = rule.permissions.some((p) =>
      permissions.includes(p)
    );

    if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [pathname, permissions, isLoading, router]);

  // Prevent flash of unauthorized content
  if (isLoading) {
    return null; // or skeleton loader
  }

  /* ================= LAYOUT ================= */

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
