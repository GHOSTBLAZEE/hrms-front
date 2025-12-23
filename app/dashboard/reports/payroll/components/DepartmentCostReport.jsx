"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

async function fetchDepartmentCost(filters) {
  const res = await apiClient.get(
    `/api/v1/payroll-reports/department`,
    { params: filters }
  );
  return res.data;
}

export default function DepartmentCostReport({ filters }) {
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-department", filters],
    queryFn: () => fetchDepartmentCost(filters),
  });

  if (isLoading) return <div>Loading department costs…</div>;

  return (
    <div className="border rounded-md divide-y text-sm">
      {data.map((row) => (
        <div
          key={row.department}
          className="flex justify-between p-3"
        >
          <span>{row.department}</span>
          <span className="font-medium">
            {row.total_cost}
          </span>
        </div>
      ))}
    </div>
  );
}
