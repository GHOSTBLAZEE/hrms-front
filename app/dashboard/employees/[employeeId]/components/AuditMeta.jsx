export default function AuditMeta({ log }) {
  return (
    <div className="text-xs text-muted-foreground mt-2">
      <div>IP: {log.ip_address}</div>
      <div className="truncate">
        UA: {log.user_agent}
      </div>
    </div>
  );
}
