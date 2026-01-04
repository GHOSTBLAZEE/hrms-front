import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "employee.employee_code",
    header: "Emp Code",
  },
  {
    header: "Employee",
    cell: ({ row }) =>
      row.original.employee?.user?.name ?? "—",
  },
  {
    accessorKey: "effective_from",
    header: "Effective From",
    cell: ({ getValue }) =>
      format(new Date(getValue()), "dd MMM yyyy"),
  },
  {
    header: "Monthly Gross",
    cell: ({ row }) => {
      const {
        basic = "0",
        hra = "0",
        allowances = "0",
      } = row.original;

      return (
        Number(basic) +
        Number(hra) +
        Number(allowances)
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) =>
      row.original.is_latest ? "Active" : "Inactive",
  },
];
