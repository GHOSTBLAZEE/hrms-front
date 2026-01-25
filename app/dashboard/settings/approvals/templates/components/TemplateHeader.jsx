export default function TemplateHeader({ template, loading }) {
  if (loading) {
    return <div className="h-10 bg-muted rounded animate-pulse" />;
  }

  if (!template) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{template.name}</h2>
        <p className="text-sm text-muted-foreground">
          {template.module.replace("_", " ").toUpperCase()}
        </p>
      </div>

      <span
        className={`px-3 py-1 rounded text-xs font-medium
          ${template.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
        `}
      >
        {template.is_active ? "Active" : "Draft"}
      </span>
    </div>
  );
}
