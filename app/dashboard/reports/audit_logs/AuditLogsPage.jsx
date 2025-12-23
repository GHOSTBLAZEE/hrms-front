"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AuditLogTable from "./components/AuditLogTable";
import AuditFilters from "./components/AuditFilters";
import apiClient from "@/lib/apiClient";
import AuditLogDrawer from "./components/AuditLogDrawer";
import { useAuth } from "@/hooks/useAuth";
import AuditExportButton from "./components/AuditExportButton";

async function fetchAuditLogs(params) {
  const res = await apiClient.get("/api/v1/audit-logs", {
    params,
  });
  return res.data;
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState(null);
  const { permissions } = useAuth();
  const canExport = permissions.includes("view audit logs");

  const [filters, setFilters] = useState({
    search: "",
    event: "",
    from: "",
    to: "",
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => fetchAuditLogs(filters),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <p className="text-muted-foreground text-sm">
            System activity & compliance records
          </p>
        </div>

        {canExport && (
          <AuditExportButton filters={filters} disabled={!data?.data?.length} />
        )}
      </header>

      <AuditFilters
        filters={filters}
        onChange={setFilters}
        logs={data?.data || []}
        canExport={canExport}
      />

      <AuditLogTable
        logs={data?.data || []}
        meta={data?.meta}
        loading={isLoading}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onRowClick={setSelectedLog}
      />
      <AuditLogDrawer
        open={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
