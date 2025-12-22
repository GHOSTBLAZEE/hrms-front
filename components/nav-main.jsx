"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavItem
              key={item.title}
              item={item}
              pathname={pathname}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/* ================= SINGLE ITEM ================= */

function NavItem({ item, pathname }) {
  const hasSubMenu = item.subMenu?.length > 0;
  const isActive =
    pathname === item.url ||
    item.subMenu?.some((sub) =>
      pathname.startsWith(sub.url)
    );

  const [open, setOpen] = useState(isActive);

  // 🔹 Simple item (no submenu)
  if (!hasSubMenu) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link
            href={item.url}
            className="flex items-center gap-2"
          >
            {item.icon && (
              <item.icon className="h-4 w-4" />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // 🔹 Parent item (with submenu)
  return (
    <SidebarMenuItem>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition",
          isActive
            ? "bg-muted font-medium"
            : "hover:bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          {item.icon && (
            <item.icon className="h-4 w-4" />
          )}
          <span>{item.title}</span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="ml-6 mt-1 space-y-1">
          {item.subMenu.map((sub) => {
            const subActive = pathname.startsWith(
              sub.url
            );

            return (
              <SidebarMenuButton
                key={sub.title}
                asChild
                isActive={subActive}
              >
                <Link
                  href={sub.url}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {sub.title}
                </Link>
              </SidebarMenuButton>
            );
          })}
        </div>
      )}
    </SidebarMenuItem>
  );
}
