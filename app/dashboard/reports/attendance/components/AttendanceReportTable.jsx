import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "../columns";

export default function AttendanceReportTable({ data, loading }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
    />
  );
}
