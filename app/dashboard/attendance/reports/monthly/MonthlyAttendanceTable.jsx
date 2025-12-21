"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function MonthlyAttendanceTable({ data }) {
  return <DataTable columns={columns} data={data} />;
}
