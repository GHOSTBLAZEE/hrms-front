"use client";

import { Badge } from "@/components/ui/badge";

export default function TeamPunchTable({ data }) {
  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No attendance data available.
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y">
      {data.map((row) => (
        <div
          key={row.employee_id}
          className="p-3 flex justify-between items-start"
        >
          <div>
            <div className="font-medium">
              {row.employee_name}
            </div>
            <div className="text-xs text-muted-foreground">
              Status: {row.status ?? "—"}
            </div>

            <div className="mt-2 space-y-1 text-sm">
              {row.logs.map((log, i) => (
                <div key={i}>
                  <Badge
                    variant={
                      log.type === "IN"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {log.type}
                  </Badge>{" "}
                  {new Date(
                    log.punch_time
                  ).toLocaleTimeString()}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({log.source})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {row.is_locked && (
            <Badge variant="destructive">Locked</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
