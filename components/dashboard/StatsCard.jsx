export default function StatsCard({ title, value }) {
  return (
    <div className="border rounded p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
