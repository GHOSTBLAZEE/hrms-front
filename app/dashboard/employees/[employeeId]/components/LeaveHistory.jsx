import { useEmployeeLeaveBalances } from "../hooks/useEmployeeLeaveBalances";


export default function LeaveHistory({ employeeId }) {
  const { data, isLoading } =
    useEmployeeLeaveBalances(employeeId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading leave history…
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave records
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {data.map((leave) => (
        <div
          key={leave.id}
          className="border rounded p-3"
        >
          <div className="font-medium">
            {leave.leave_type?.name}
          </div>

          <div className="text-muted-foreground">
            {leave.start_date} → {leave.end_date} •{" "}
            <Status status={leave.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Status({ status }) {
  return (
    <span
      className={
        status === "approved"
          ? "text-green-600"
          : status === "rejected"
          ? "text-red-600"
          : "text-yellow-600"
      }
    >
      {status}
    </span>
  );
}
