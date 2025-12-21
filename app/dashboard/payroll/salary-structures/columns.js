export const columns = [
  {
    accessorKey: "employee.code",
    header: "Emp Code",
  },
  {
    accessorKey: "employee.name",
    header: "Employee",
  },
  {
    accessorKey: "effective_from",
    header: "Effective From",
  },
  {
    accessorKey: "ctc",
    header: "CTC",
  },
  {
    header: "Status",
    cell: ({ row }) =>
      row.original.active ? "Active" : "Inactive",
  },
];
