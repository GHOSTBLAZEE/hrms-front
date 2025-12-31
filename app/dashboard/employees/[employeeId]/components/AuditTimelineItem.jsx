import { formatDistanceToNow } from "date-fns";
import AuditDiff from "./AuditDiff";
import AuditMeta from "./AuditMeta";


export default function AuditTimelineItem({ log }) {
  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">
            {log.event.toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {log.user?.name ?? "System"} •{" "}
            {formatDistanceToNow(new Date(log.created_at))} ago
          </p>
        </div>
      </div>

      <AuditDiff
        oldValues={log.old_values}
        newValues={log.new_values}
      />

      <AuditMeta log={log} />
    </div>
  );
}
