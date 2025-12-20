// app/dashboard/settings/departments/columns.js

import { selectColumn } from "@/components/data-table/select-column";
import DataTableActions from "@/components/data-table/DataTableActions";

export const columns = ({ onEdit, onDelete }) => [
  selectColumn,
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions
        row={row}
        permissionPrefix="departments"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
