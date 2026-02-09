"use client";

import { useState } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";

import { useAuth } from "@/hooks/useAuth";
import { routePermissions } from "@/config/route-permissions";

export default function DashboardLayout({ children }) {
  const { user, permissions = [], isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // 🔐 AUTH GUARD
    if (!user) {
      router.replace("/login");
      return;
    }

    // 🔐 PERMISSION GUARD
    const rule = routePermissions.find((r) => pathname.startsWith(r.path));

    if (!rule) return;

    const allowed = rule.permissions.some((p) => permissions.includes(p));

    if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [user, pathname, permissions, isLoading, router]);

  // ⛔ Prevent UI flash
  if (isLoading || !user) {
    return null;
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 14)",
      }}
    >
      {/* Clean Sidebar - Navigation Only */}
      <AppSidebar variant="inset" />

      <SidebarInset className="overflow-hidden">
        {/* Enhanced Header - Search + Quick Actions + Notifications */}
        <SiteHeader onOpenCommandPalette={() => setCommandOpen(true)} />
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4">
          {children}
        </div>
      </SidebarInset>

      {/* Command Palette - Global Search */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}