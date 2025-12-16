import { Button } from "@/components/ui/button";

export const columns = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const emp = row.original;

      return (
        <div className="flex gap-2">
          {emp.can.update && <Button size="sm">Edit</Button>}
          {emp.can.delete && (
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          )}
        </div>
      );
    },
  },
];
