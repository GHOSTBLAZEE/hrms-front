"use client";

import { Star } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function QuickAccessMenu({ items, onItemClick }) {
  if (!items || items.length === 0) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center gap-2">
        <Star className="h-3 w-3" />
        Quick Access
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.slice(0, 5).map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              onClick={() => onItemClick?.(item)}
            >
              <a href={item.url} className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className="flex-1">{item.title}</span>
                {item.shortcut && (
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {item.shortcut.key.toUpperCase()}
                  </kbd>
                )}
                {item.notifications && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {item.notifications.type === "dot" ? (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    ) : (
                      "3"
                    )}
                  </Badge>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}