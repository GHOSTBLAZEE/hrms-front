"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

import AuditLogTable from "./components/AuditLogTable";
import AuditFilters from "./components/AuditFilters";
import AuditLogDrawer from "./components/AuditLogDrawer";
import AuditExportButton from "./components/AuditExportButton";
import { useAuth } from "@/hooks/useAuth";

async function fetchAuditLogs(params) {
  const res = await apiClient.get("/api/v1/audit-logs", {
    params,
  });
  return res.data;
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState(null);
  const { permissions = [] } = useAuth();
  const canExport = permissions.includes("view audit logs");

  const searchParams = useSearchParams();
  const entity = searchParams.get("entity");
  const entityId = searchParams.get("entity_id");

  // User-controlled filters
  const [filters, setFilters] = useState({
    search: "",
    event: "",
    from: "",
    to: "",
    page: 1,
  });

  // ✅ Merge URL filters safely (derived, not state)
  const queryFilters = useMemo(
    () => ({
      ...filters,
      auditable_type: entity || undefined,
      auditable_id: entityId || undefined,
    }),
    [filters, entity, entityId]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", queryFilters],
    queryFn: () => fetchAuditLogs(queryFilters),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Audit Logs
          </h1>
          <p className="text-muted-foreground text-sm">
            System activity & compliance records
          </p>
        </div>

        {canExport && (
          <AuditExportButton
            filters={queryFilters}
            disabled={!data?.data?.length}
          />
        )}
      </header>

      {/* ✅ Context banner when deep-linked */}
      {entity && entityId && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Showing audit history for{" "}
          <b>{entity}</b> #{entityId}
        </div>
      )}

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
        onPageChange={(page) =>
          setFilters((f) => ({
            ...f,
            page,
          }))
        }
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
