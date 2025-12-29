export default function ProfileHeader({ employee }) {
  if (!employee) return null;

  return (
    <div className="border rounded-md p-4">
      <h2 className="text-lg font-semibold">
        {employee?.user?.name ?? "Employee"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {employee?.employee_code}
      </p>
    </div>
  );
}
