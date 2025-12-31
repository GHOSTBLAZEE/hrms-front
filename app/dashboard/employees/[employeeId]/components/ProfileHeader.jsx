export default function ProfileHeader({ employee }) {
  if (!employee) return null;

  const user = employee.user;

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Identity */}
        <div className="flex items-start gap-4">
          {/* Avatar / Initial */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user?.name?.charAt(0)?.toUpperCase() ?? "E"}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight">
              {user?.name ?? "Employee"}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{employee.employee_code}</span>

              {employee.department && (
                <>
                  <span>•</span>
                  <span>{employee.department.name}</span>
                </>
              )}

              {employee.designation && (
                <>
                  <span>•</span>
                  <span>{employee.designation.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status / Actions */}
        <div className="flex items-center gap-2">
          {/* Status badge (future-proof) */}
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>

          {/* Action placeholder (permission-based later) */}
          {/* 
          <Button size="sm" variant="outline">
            Edit
          </Button> 
          */}
        </div>
      </div>
    </div>
  );
}
