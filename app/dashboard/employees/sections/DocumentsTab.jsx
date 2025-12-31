"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import DocumentUploadDialog from "../[employeeId]/components/DocumentUploadDialog";
import DocumentTable from "../[employeeId]/components/DocumentTable";

export default function DocumentsTab({ employee }) {
  const { permissions = [] } = useAuth();

  const canView = hasPermission(
    permissions,
    ["view employee documents"]
  );

  const canUpload = hasPermission(
    permissions,
    ["upload employee documents"]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["employee-documents", employee.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employee.id}/documents`
      );
      return res.data;
    },
    enabled: canView,
  });

  if (!canView) {
    return (
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        You do not have permission to view employee documents.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading documents…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <div className="flex justify-end">
          <DocumentUploadDialog employeeId={employee.id} />
        </div>
      )}

      <DocumentTable documents={data ?? []} />
    </div>
  );
}
