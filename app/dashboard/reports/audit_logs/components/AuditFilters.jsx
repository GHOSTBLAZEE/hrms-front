"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuditFilters({ filters, onChange }) {
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
        onChange={(e) =>
          onChange({ ...filters, to: e.target.value, page: 1 })
        }
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
    </div>
  );
}
