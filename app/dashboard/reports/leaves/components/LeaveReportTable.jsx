import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "../columns";

export default function LeaveReportTable({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
}
