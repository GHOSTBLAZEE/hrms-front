"use client";

import { DataTable } from "@/components/data-table";
import AdjustmentDiffCell from "./AdjustmentDiffCell";

const columns = [
  {
    accessorKey: "employee_name",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    header: "Check In",
    cell: ({ row }) => (
      <AdjustmentDiffCell
        original={row.original.original_check_in}
        adjusted={row.original.adjusted_check_in}
      />
    ),
  },
  {
    header: "Check Out",
    cell: ({ row }) => (
      <AdjustmentDiffCell
        original={row.original.original_check_out}
        adjusted={row.original.adjusted_check_out}
      />
    ),
  },
  {
    header: "Work Hours",
    cell: ({ row }) => (
      <AdjustmentDiffCell
        original={row.original.original_work_hours}
        adjusted={row.original.adjusted_work_hours}
        suffix=" h"
      />
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
  },
];

export default function AdjustmentPreviewTable({ data }) {
  return <DataTable columns={columns} data={data} />;
}
