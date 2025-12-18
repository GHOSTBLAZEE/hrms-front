"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuConfig } from "@/config/menuConfig";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const { permissions } = useAuth();

  const hasPermission = (required = []) => {
    if (required.length === 0) return true;
    return required.some((p) => permissions.includes(p));
  };

  return (
    <aside className="w-64 border-r h-screen p-4">
      <h1 className="text-xl font-semibold mb-6">HRMS</h1>

      <nav className="space-y-1">
        {menuConfig.map((item) => {
          if (!hasPermission(item.permissions)) return null;

          if (item.children) {
            return (
              <div key={item.title}>
                <div className="text-xs text-muted-foreground mt-4 mb-1">
                  {item.title}
                </div>

                {item.children.map((child) =>
                  hasPermission(child.permissions) ? (
                    <Link
                      key={child.title}
                      href={child.url}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted",
                        pathname === child.url && "bg-muted"
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      {child.title}
                    </Link>
                  ) : null
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted",
                pathname === item.url && "bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
