"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { menu } from "@/config/menu";
import { useAuth } from "@/hooks/useAuth";

/* ================= PERMISSION HELPERS ================= */

function canShowItem(userPermissions, requiredPermissions) {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  return requiredPermissions.some((p) =>
    userPermissions.includes(p)
  );
}

function canShowAnySubMenu(userPermissions, item) {
  if (!item.subMenu) return false;

  return item.subMenu.some((sub) =>
    canShowItem(userPermissions, sub.permissions)
  );
}

/* ================= SIDEBAR ================= */

export function AppSidebar(props) {
  const { user, permissions = [], isLoading } = useAuth();

  if (isLoading) return null;

  const mainItems = menu.main
    .map((item) => {
      const showParent =
        canShowItem(permissions, item.permissions) ||
        canShowAnySubMenu(permissions, item);

      if (!showParent) return null;

      return {
        ...item,
        subMenu: item.subMenu?.filter((sub) =>
          canShowItem(permissions, sub.permissions)
        ),
      };
    })
    .filter(Boolean);

  const settingsItems = menu.settings.filter((item) =>
    canShowItem(permissions, item.permissions)
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-3 py-2 text-lg font-semibold">HRMS</div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainItems} />
        {settingsItems.length > 0 && (
          <NavSecondary items={settingsItems} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
