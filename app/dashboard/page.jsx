"use client";

import { useDashboard } from "@/hooks/useDashboard";
import TodaySummaryCard from "@/components/dashboard/TodaySummaryCard";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import PendingApprovals from "@/components/dashboard/PendingApprovals";
import StatsCard from "@/components/dashboard/StatsCard";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TodaySummaryCard attendance={data.todayAttendance} />
        <MiniCalendar />
        {data.can.view_employee_stats && (
          <StatsCard title="Employees" value={data.employeeCount} />
        )}
      </div>

      {data.can.view_approvals && (
        <PendingApprovals leaves={data.pendingLeaves} />
      )}
    </div>
  );
}
