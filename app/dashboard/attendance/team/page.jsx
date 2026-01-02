"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TeamPunchTable from "./TeamPunchTable";

export default function TeamAttendancePage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["team-attendance-today"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/attendance/team/today"
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading team attendance…</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Team Attendance (Today)
      </h1>

      <TeamPunchTable data={data} />
    </div>
  );
}
