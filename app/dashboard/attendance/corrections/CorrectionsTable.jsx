"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function CorrectionsTable({ data, onSelect }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onSelect}
    />
  );
}
