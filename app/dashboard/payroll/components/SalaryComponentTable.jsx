"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function SalaryComponentTable({ data }) {
  return <DataTable columns={columns} data={data} />;
}
