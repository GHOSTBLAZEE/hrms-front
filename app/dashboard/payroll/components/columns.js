export const columns = [
  {
    accessorKey: "name",
    header: "Component",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      row.original.type === "earning" ? "Earning" : "Deduction",
  },
  {
    accessorKey: "calculation_type",
    header: "Calculation",
  },
  {
    header: "Value",
    cell: ({ row }) =>
      row.original.value !== null
        ? row.original.value
        : "-",
  },
  {
    header: "Taxable",
    cell: ({ row }) =>
      row.original.taxable ? "Yes" : "No",
  },
  {
    header: "Status",
    cell: ({ row }) =>
      row.original.active ? "Active" : "Inactive",
  },
];
