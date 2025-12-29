"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import { toast } from "sonner";

export default function DocumentsTab({ employee }) {
  const { permissions } = useAuth();
  const qc = useQueryClient();

  const canUpload = hasPermission(
    permissions,
    ["upload employee documents"]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["employee-documents", employee.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `api/v1/employees/${employee.id}/documents`
      );
      return res.data;
    },
    staleTime: 60_000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return apiClient.post(
        `/employees/${employee.id}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    },
    onSuccess: () => {
      toast.success("Document uploaded");
      qc.invalidateQueries(["employee-documents", employee.id]);
    },
    onError: () => {
      toast.error("Upload failed");
    },
  });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "general"); // or from a select later

    uploadMutation.mutate(fd);
    e.target.value = "";
  };

  if (isLoading) return <div>Loading documents…</div>;

  const docs = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>

        {canUpload && (
          <label className="text-sm border rounded px-3 py-1 cursor-pointer">
            Upload
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        )}
      </div>

      {/* List */}
      {docs.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No documents uploaded
        </div>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">
                  Uploaded {doc.created_at}
                </div>
              </div>

              <a
                href={`/api/v1/employee-documents/${doc.id}/download`}
                className="text-sm underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
