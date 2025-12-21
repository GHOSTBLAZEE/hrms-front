"use client";

import { DataTable } from "@/components/data-table";

const columns = [
  { accessorKey: "month", header: "Month" },
  { accessorKey: "employee.name", header: "Employee" },
  { accessorKey: "gross", header: "Gross" },
  { accessorKey: "net_pay", header: "Net Pay" },
];

export default function PayslipTable({ data, onSelect }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onSelect}
    />
  );
}
