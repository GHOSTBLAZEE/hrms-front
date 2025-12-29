export default function ProfileSummary({ employee }) {
  return (
    <div className="border rounded-md p-4 text-sm space-y-2">
      <Row label="Employee Code" value={employee.employee_code} />
      <Row label="Name" value={employee.user?.name} />
      <Row label="Department" value={employee.department?.name} />
      <Row label="Designation" value={employee.designation?.name} />
      <Row label="Location" value={employee.location?.name} />
      <Row label="Status" value={employee.status} />
      <Row label="Phone" value={employee.phone || "—"} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
