"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import AuditTimelineItem from "../[employeeId]/components/AuditTimelineItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Shield, History, FileText } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Audit Trail</h2>
            <p className="text-sm text-muted-foreground">
              Complete history of employee record changes
            </p>
          </div>
        </div>

        {data?.length > 0 && (
          <Badge variant="outline" className="font-normal">
            {data.length} {data.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {!data || data.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Audit History
          </h3>
          <p className="text-sm text-muted-foreground">
            No audit history available for this employee yet.
          </p>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <History className="h-5 w-5 text-slate-600" />
            <h3 className="text-base font-semibold">Activity Timeline</h3>
          </div>

          <div className="space-y-4">
            {data.map((log) => (
              <AuditTimelineItem key={log.id} log={log} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}