import StatusBadge from "./components/StatusBadge";

export const approvalColumns = [
  {
    accessorKey: "employee.name",
    header: "Employee",
    cell: ({ row }) =>
      row.original.employee?.name ?? "—",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      row.original.type
        .replace("_", " ")
        .toUpperCase(),
  },
  {
    accessorKey: "created_at",
    header: "Submitted",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  },
];
