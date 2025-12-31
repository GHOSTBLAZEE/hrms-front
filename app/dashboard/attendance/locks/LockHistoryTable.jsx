"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LockHistoryTable({ history = [] }) {
  if (!history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lock History</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No lock history available for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lock History</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <div>
                <div className="font-medium">
                  {item.action.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.performed_by?.name ?? "System"} ·{" "}
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>

              <Badge
                variant={
                  item.action === "locked"
                    ? "destructive"
                    : "secondary"
                }
              >
                {item.action}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
