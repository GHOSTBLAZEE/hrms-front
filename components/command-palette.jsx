"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { searchMenu, trackMenuClick } from "@/config/menuData";

export function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchMenu(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (item) => {
    trackMenuClick(item);
    router.push(item.url);
    onOpenChange(false);
    setQuery("");
  };

  // Global keyboard shortcut (Cmd+K or Ctrl+K)
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search menu, features, or pages..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.length === 0 ? (
          <CommandEmpty>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Type to search menu items...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Try: "employees", "attendance", "leaves", "payroll"
              </p>
            </div>
          </CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            </div>
          </CommandEmpty>
        ) : (
          <>
            <CommandGroup heading="Results">
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 py-3"
                >
                  {item.icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      {item.status && (
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] ${
                            item.status === "new" ? "bg-blue-100 text-blue-700" :
                            item.status === "beta" ? "bg-purple-100 text-purple-700" :
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    {item.breadcrumb && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {Array.isArray(item.breadcrumb) 
                          ? item.breadcrumb.join(" › ")
                          : item.breadcrumb.path?.join(" › ") || item.breadcrumb.label || ""}
                      </div>
                    )}
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      <span className="text-xs">⌘</span>
                      {item.shortcut.key.toUpperCase()}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}