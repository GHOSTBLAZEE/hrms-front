export default function SlaEditor({ value }) {
  return (
    <div className="text-xs text-muted-foreground">
      SLA: <span className="font-medium text-foreground">{value} days</span>
    </div>
  );
}
