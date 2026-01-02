import StatusBadge from "./components/StatusBadge";

export const approvalColumns = [
  {
    header: "Employee",
    cell: ({ row }) =>
      row.original.employee?.name ?? "—",
  },

  {
    header: "Type",
    cell: ({ row }) => {
      const map = {
        attendance: "Attendance Correction",
        leave: "Leave Request",
        overtime: "Overtime Request",
      };

      return map[row.original.type] ?? row.original.type;
    },
  },

  {
    header: "Submitted",
    cell: ({ row }) =>
      new Date(row.original.submitted_at).toLocaleDateString(),
  },

  {
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  },
];
