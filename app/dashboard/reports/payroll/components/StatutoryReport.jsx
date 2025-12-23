"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

async function fetchStatutory(filters) {
  const res = await apiClient.get(
    `/api/v1/payroll-reports/statutory`,
    { params: filters }
  );
  return res.data;
}

export default function StatutoryReport({ filters }) {
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-statutory", filters],
    queryFn: () => fetchStatutory(filters),
  });

  if (isLoading) return <div>Loading statutory report…</div>;

  return (
    <div className="border rounded-md p-4 space-y-2 text-sm">
      <Row label="PF (Employer)" value={data.pf_employer} />
      <Row label="PF (Employee)" value={data.pf_employee} />
      <Row label="ESI" value={data.esi} />
      <Row label="TDS" value={data.tds} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
