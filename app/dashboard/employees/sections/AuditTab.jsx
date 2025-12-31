"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import AuditTimelineItem from "../[employeeId]/components/AuditTimelineItem";


export default function AuditTab({ employee }) {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-audit", employee.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employee.id}/audit-logs`
      );
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading audit logs…</div>;

  if (!data?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No audit history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((log) => (
        <AuditTimelineItem key={log.id} log={log} />
      ))}
    </div>
  );
}
