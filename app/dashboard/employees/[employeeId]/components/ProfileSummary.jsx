export default function ProfileSummary({ employee }) {
  if (!employee) return null;

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="grid grid-cols-1 gap-3 text-sm">
        <Row label="Employee Code" value={employee.employee_code} />

        <Row
          label="Name"
          value={employee.user?.name}
          emphasize
        />

        <Row
          label="Department"
          value={employee.department?.name}
        />

        <Row
          label="Designation"
          value={employee.designation?.name}
        />

        <Row
          label="Location"
          value={employee.location?.name}
        />

        <Row
          label="Status"
          value={
            <StatusBadge status={employee.status} />
          }
        />

        <Row
          label="Phone"
          value={employee.phone || "—"}
        />
      </div>
    </div>
  );
}

function Row({ label, value, emphasize = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span
        className={`text-right ${
          emphasize ? "font-medium" : ""
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return "—";

  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"
        }
      `}
    >
      {isActive ? "Active" : status}
    </span>
  );
}
