import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";

export default function SalaryStructureTable({
  data,
  onSelectEmployee,
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onSelectEmployee(row.employee)}
    />
  );
}
