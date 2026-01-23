"use client";

import { useMyLeaveBalances } from "@/app/dashboard/leaves/hooks/useMyLeaveBalances";
import { useEmployeeLeaveBalances } from "../hooks/useEmployeeLeaveBalances";


import LeaveBalanceCard from "./LeaveBalanceCard";
import LeaveBalanceSkeleton from "./LeaveBalanceSkeleton";

/**
 * LeaveBalanceCards
 *
 * Admin usage:  <LeaveBalanceCards employeeId={id} />
 * Employee usage: <LeaveBalanceCards />
 */
export default function LeaveBalanceCards({ employeeId }) {
  const query = employeeId
    ? useEmployeeLeaveBalances(employeeId) // ADMIN / HR
    : useMyLeaveBalances();                // EMPLOYEE SELF

  const { data, isLoading } = query;

  if (isLoading) return <LeaveBalanceSkeleton />;

  const balances = data?.balances ?? [];

  if (!balances.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No leave balances available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {balances.map((balance) => (
        <LeaveBalanceCard
          key={balance.leave_type_id}
          balance={balance}
        />
      ))}
    </div>
  );
}
