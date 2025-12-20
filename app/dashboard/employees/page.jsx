"use client";

import  {DataTable}  from "@/components/data-table/DataTable";
import { columns } from "./column";
import { useEmployees } from "@/hooks/useEmployees";

export default function EmployeesPage() {
  const { data, isLoading } = useEmployees();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Employees</h1>
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
