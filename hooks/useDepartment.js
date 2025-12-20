"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/departmentApi";
import { toast } from "sonner";

export function useDepartments() {
  const qc = useQueryClient();

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: api.getDepartmentsApi,
  });

  const create = useMutation({
    mutationFn: api.createDepartmentApi,
    onSuccess: () => {
      toast.success("Department created");
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateDepartmentApi(id, data),
    onSuccess: () => {
      toast.success("Department updated");
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const remove = useMutation({
    mutationFn: api.deleteDepartmentApi,
    onSuccess: () => {
      toast.success("Department deleted");
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const openCreateDialog = () => {
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (dept) => {
    setEditingDepartment(dept);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingDepartment(null);
    setIsDialogOpen(false);
  };

  return {
    departments: data,
    editingDepartment,
    isDialogOpen,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    createDepartment: create.mutateAsync,
    updateDepartment: update.mutateAsync,
    deleteDepartment: remove.mutateAsync,
  };
}
