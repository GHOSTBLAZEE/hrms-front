"use client";

import { useEmployeeLeaveBalances } from "../hooks/useEmployeeLeaveBalances";
import LeaveBalanceCard from "./LeaveBalanceCard";
import LeaveBalanceSkeleton from "./LeaveBalanceSkeleton";

export default function LeaveBalanceCards({ employeeId }) {
  const { data, isLoading } =
    useEmployeeLeaveBalances(employeeId);

  if (isLoading) {
    return <LeaveBalanceSkeleton />;
  }

  if (!data?.balances?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave balances available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.balances.map((balance) => (
        <LeaveBalanceCard
          key={balance.leave_type_id}
          balance={balance}
        />
      ))}
    </div>
  );
}
