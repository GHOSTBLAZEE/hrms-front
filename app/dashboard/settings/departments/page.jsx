"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";
import { useDepartments } from "@/hooks/useDepartment";
import DepartmentDialog from "./DepartmentDialog";
import { Button } from "@/components/ui/button";

export default function DepartmentsPage() {
  const {
    departments,
    deleteDepartment,
    openEditDialog,
    openCreateDialog,
    closeDialog,
    isDialogOpen,
    editingDepartment,
    createDepartment,
    updateDepartment,
  } = useDepartments();

  const handleSubmit = async (data) => {
    if (editingDepartment) {
      await updateDepartment({
        id: editingDepartment.id,
        data,
      });
    } else {
      await createDepartment(data);
    }
    closeDialog();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}>Add Department</Button>
      </div>

      <DataTable
        data={departments}
        columns={columns({
          onEdit: openEditDialog,
          onDelete: deleteDepartment,
        })}
        globalFilterKeys={["name", "code", "status"]}
      />

      <DepartmentDialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
        initialData={editingDepartment}
        onSubmit={handleSubmit}
      />
    </>
  );
}
