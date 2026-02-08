"use client";

import * as React from "react";
import { Building2 } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-settings";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { useAuth } from "@/hooks/useAuth";
import { useCompanyFeature } from "@/hooks/useCompanyFeature";
import { getFilteredNavigation, trackMenuClick } from "@/config/menuData";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

export function AppSidebar({ ...props }) {
  const { user, permissions = [], isLoading } = useAuth();
  const { featureFlags = {} } = useFeatureFlags();
  const { companyFeature } = useCompanyFeature();

  if (isLoading) return null;

  // Build context for menu filtering
  const menuContext = {
    featureFlags,
    userPlan: companyFeature?.plan || "free",
    tenantType: companyFeature?.type || "single-tenant",
    user: {
      isAdmin: user?.is_admin || false,
      isOwner: user?.is_owner || false,
      roles: user?.roles || [],
      ...user,
    },
  };

  // Get filtered navigation
  const { navMain, settings } = getFilteredNavigation(permissions, menuContext);

  // Handle menu click
  const handleMenuClick = (item) => {
    trackMenuClick(item);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Simple Header - Just Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a 
                href="/dashboard" 
                onClick={() => handleMenuClick({ 
                  title: "Dashboard", 
                  analytics: { event: "click_logo", category: "navigation" } 
                })}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {companyFeature?.name || "HRMS"}
                  </span>
                  <span className="truncate text-xs">
                    {companyFeature?.tagline || "Enterprise System"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Clean Content - Just Navigation */}
      <SidebarContent>
        <NavMain items={navMain} onItemClick={handleMenuClick} />
        {settings.length > 0 && <NavSettings items={settings} onItemClick={handleMenuClick} />}
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}