"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export default function LeavesTab({ employee }) {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-leaves", employee.id],
    queryFn: async () => {
      // ❌ NEVER pass employee_id in profile context
      const res = await apiClient.get("/api/v1/leaves");
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading leaves…</div>;
  }

  if (!data?.data?.length) {
    return (
      <div className="text-muted-foreground">
        No leave records
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {data.data.map((leave) => (
        <div
          key={leave.id}
          className="border rounded p-3"
        >
          <div className="font-medium">
            {leave.leave_type?.name}
          </div>
          <div className="text-muted-foreground">
            {leave.start_date} → {leave.end_date} •{" "}
            {leave.status}
          </div>
        </div>
      ))}
    </div>
  );
}
