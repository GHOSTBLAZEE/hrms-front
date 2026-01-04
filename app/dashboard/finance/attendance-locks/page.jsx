"use client";

import { useAttendanceLockTimeline } from "./hooks/useAttendanceLockTimeline";



export default function AttendanceLockTimelinePage() {
  const { data = [], isLoading } = useAttendanceLockTimeline();

  if (isLoading) {
    return <div className="p-6">Loading lock timeline…</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Attendance Lock Timeline
      </h1>

      <div className="space-y-3">
        {data.map((l, idx) => (
          <div
            key={idx}
            className="rounded-md border p-4"
          >
            <div className="flex justify-between">
              <div className="font-medium">
                {l.month}/{l.year}
              </div>

              <span
                className={`text-sm ${
                  l.status === "locked"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {l.status.toUpperCase()}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              {l.locked_at
                ? `Locked at ${new Date(l.locked_at).toLocaleString()}`
                : "Currently unlocked"}
            </div>

            <div className="text-sm">
              By: <strong>{l.locked_by}</strong>
            </div>

            {l.reason && (
              <div className="text-sm italic text-muted-foreground">
                Reason: {l.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
