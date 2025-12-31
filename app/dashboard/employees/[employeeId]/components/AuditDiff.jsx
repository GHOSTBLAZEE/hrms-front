export default function AuditDiff({
  oldValues = {},
  newValues = {},
}) {
  const keys = Object.keys(newValues || {});

  if (!keys.length) return null;

  return (
    <div className="mt-3 space-y-1 text-xs">
      {keys.map((key) => (
        <div
          key={key}
          className="grid grid-cols-3 gap-2"
        >
          <span className="text-muted-foreground">
            {key}
          </span>

          <span className="line-through text-red-500">
            {String(oldValues?.[key] ?? "—")}
          </span>

          <span className="text-green-600">
            {String(newValues?.[key])}
          </span>
        </div>
      ))}
    </div>
  );
}

