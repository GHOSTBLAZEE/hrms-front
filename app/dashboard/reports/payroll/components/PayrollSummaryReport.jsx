"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

async function fetchSummary({ year, month }) {
  const res = await apiClient.get(
    `/reports/payroll-runs`,
    { params: { year, month } }
  );
  return res.data;
}

export default function PayrollSummaryReport({ filters }) {
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-summary", filters],
    queryFn: () => fetchSummary(filters),
  });
console.log(data);

  if (isLoading) return <div>Loading summary…</div>;

  return (
    <div className="border rounded-md p-4 grid grid-cols-3 gap-4 text-sm">
      <Stat label="Employees Paid" value={data.employees} />
      <Stat label="Gross Pay" value={data.gross} />
      <Stat label="Deductions" value={data.deductions} />
      <Stat label="Net Pay" value={data.net_pay} strong />
    </div>
  );
}

function Stat({ label, value, strong }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className={strong ? "font-semibold" : ""}>
        {value}
      </div>
    </div>
  );
}
