"use client";

import { Bell, Search, Zap, Command } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { getBreadcrumbWithUrls, getQuickAccessItems, trackMenuClick } from "@/config/menuData";
import React from "react";

export function SiteHeader({ onOpenCommandPalette }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get breadcrumb items with URLs
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbWithUrls(pathname);
  }, [pathname]);
  
  // Get quick access items (limit to top 5)
  const quickAccessItems = getQuickAccessItems().slice(0, 5);

  const handleQuickAction = (item) => {
    trackMenuClick(item);
    router.push(item.url);
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-2 px-3">
        {/* Sidebar Toggle */}
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.url}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side: Search + Quick Actions + Notifications */}
      <div className="flex items-center gap-2 px-3">
        
        {/* Quick Actions Dropdown */}
        {quickAccessItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Zap className="h-4 w-4" />
                <span className="sr-only">Quick Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Quick Access
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickAccessItems.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleQuickAction(item)}
                  className="cursor-pointer"
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span className="flex-1">{item.title}</span>
                  {item.shortcut && (
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      {item.shortcut.key.toUpperCase()}
                    </kbd>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Search Button (Opens Command Palette) */}
        <Button
          variant="outline"
          className="h-8 w-48 justify-start text-sm text-muted-foreground"
          onClick={onOpenCommandPalette}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search...</span>
          <span className="lg:hidden">Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications (3)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-medium text-sm">Leave Request</span>
                <span className="ml-auto text-xs text-muted-foreground">2m ago</span>
              </div>
              <p className="text-xs text-muted-foreground">
                John Doe requested 3 days leave starting tomorrow
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="font-medium text-sm">Attendance Correction</span>
                <span className="ml-auto text-xs text-muted-foreground">15m ago</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Sarah Smith submitted an attendance correction
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium text-sm">New Employee</span>
                <span className="ml-auto text-xs text-muted-foreground">1h ago</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mike Johnson has been added to Engineering team
              </p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}