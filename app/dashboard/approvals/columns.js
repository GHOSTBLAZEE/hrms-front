import StatusBadge from "./components/StatusBadge";

export const approvalColumns = [
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => row.original.employee?.name ?? "—",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      const map = {
        leave: "Leave Request",
        attendance: "Attendance Correction",
        attendance_unlock: "Attendance Unlock",
      };
      return map[type] ?? type ?? "—";
    },
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted",
    cell: ({ row }) => {
      const date = row.original.submitted_at;
      if (!date) return "—";
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];