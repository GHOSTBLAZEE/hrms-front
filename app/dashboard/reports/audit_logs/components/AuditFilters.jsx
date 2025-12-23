"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportAuditCsv } from "../utils/exportAuditCsv";
import { exportAuditExcel } from "../utils/exportAuditExcel";

export default function AuditFilters({ filters, onChange, logs, canExport }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search user / action"
        value={filters.search}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value, page: 1 })
        }
        className="w-64"
      />

      <Input
        type="date"
        value={filters.from}
        onChange={(e) =>
          onChange({ ...filters, from: e.target.value, page: 1 })
        }
      />

      <Input
        type="date"
        value={filters.to}
        onChange={(e) => onChange({ ...filters, to: e.target.value, page: 1 })}
      />

      <Button
        variant="secondary"
        onClick={() =>
          onChange({
            search: "",
            event: "",
            from: "",
            to: "",
            page: 1,
          })
        }
      >
        Reset
      </Button>
      <div className="flex flex-wrap items-center gap-3">
        {/* existing filters */}

        {canExport && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAuditCsv(logs)}
            >
              Export CSV
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAuditExcel(logs)}
            >
              Export Excel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
