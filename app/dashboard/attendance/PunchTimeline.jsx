"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PunchTimeline({ punches = [] }) {
  if (!punches.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Punch Timeline</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No punches recorded for today.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Punch Timeline</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {punches.map((punch, index) => (
            <div
              key={punch.id ?? index}
              className="flex items-center justify-between border rounded px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    punch.type === "IN"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {punch.type}
                </Badge>

                <span>
                  {new Date(
                    punch.punch_time
                  ).toLocaleTimeString()}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                {punch.source ?? "web"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
