export default function ApproverSelector({ approvers = [] }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">Approvers</p>
      <div className="flex flex-wrap gap-2">
        {approvers.map((u) => (
          <span
            key={u.id}
            className="px-2 py-1 rounded bg-muted text-xs"
          >
            {u.name}
          </span>
        ))}
      </div>
    </div>
  );
}
