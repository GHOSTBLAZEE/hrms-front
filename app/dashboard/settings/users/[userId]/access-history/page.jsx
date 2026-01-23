"use client";

import { useAccessHistory } from "@/hooks/useAccessHistory";

export default function AccessHistoryPage({ params }) {
  const { data, isLoading } = useAccessHistory(params.userId);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">
        Access Change History
      </h1>

      {data.data.map(log => (
        <div
          key={log.id}
          className="border rounded p-4 space-y-1"
        >
          <div className="text-sm font-medium">
            {log.event.replaceAll(".", " ")}
          </div>

          <div className="text-xs text-muted-foreground">
            By {log.user?.name ?? "System"} ·{" "}
            {new Date(log.created_at).toLocaleString()}
          </div>

          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
            {JSON.stringify(log.new_values, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
