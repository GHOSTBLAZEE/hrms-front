"use client";


import { DataTable } from "@/components/data-table/DataTable";
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
