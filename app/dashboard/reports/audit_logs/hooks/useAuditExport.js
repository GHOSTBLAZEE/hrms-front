"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useState } from "react";

export function useAuditExport() {
  const [exportId, setExportId] = useState(null);

  // ▶️ Start export
  const startExport = useMutation({
    mutationFn: async (filters) => {
      const res = await apiClient.post(
        "/api/v1/audit-logs/export",
        filters
      );
      return res.data;
    },
    onSuccess: (data) => {
      setExportId(data.export_id);
    },
  });

  // ⏳ Poll export status
  const exportStatus = useQuery({
    queryKey: ["audit-export", exportId],
    enabled: !!exportId,
    refetchInterval: (query) => {
      if (!query.state.data) return 3000;
      return query.state.data.status === "completed" ||
        query.state.data.status === "failed"
        ? false
        : 3000;
    },
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/exports/${exportId}`
      );
      return res.data;
    },
  });

  return {
    startExport,
    exportStatus,
    exportId,
  };
}
