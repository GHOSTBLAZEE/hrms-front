"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { menu } from "@/config/menuConfig"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/lib/permissions"

export function AppSidebar(props) {
  const { user, permissions } = useAuth()

  const mainItems = menu.main.filter((item) =>
    hasPermission(permissions, item.permissions)
  )

  const settingsItems = menu.settings.filter((item) =>
    hasPermission(permissions, item.permissions)
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-3 py-2 text-lg font-semibold">
          HRMS
        </div>
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
  )
}
