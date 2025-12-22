"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AuditLogTable from "./components/AuditLogTable";
import AuditFilters from "./components/AuditFilters";
import apiClient from "@/lib/apiClient";
import AuditLogDrawer from "./components/AuditLogDrawer";

async function fetchAuditLogs(params) {
  const res = await apiClient.get("/api/v1/audit-logs", {
    params,
  });
  return res.data;
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState(null);
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
      <header>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="text-muted-foreground text-sm">
          System activity & compliance records
        </p>
      </header>

      <AuditFilters filters={filters} onChange={setFilters} />

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
