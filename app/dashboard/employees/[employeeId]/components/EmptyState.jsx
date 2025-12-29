export default function EmptyState({ message = "No data available" }) {
  return (
    <div className="p-6 text-sm text-muted-foreground text-center">
      {message}
    </div>
  );
}
