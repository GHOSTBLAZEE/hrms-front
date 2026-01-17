"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

import SalaryStructureTable from "./SalaryStructureTable";
import SalaryStructureDrawer from "./SalaryStructureDrawer";
import { Button } from "@/components/ui/button";

export default function SalaryStructuresPage() {
  const qc = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: structures = [], isLoading } = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/salary-structures");
      return res.data;
    },
  });

  const createSalaryMutation = useMutation({
    mutationFn: async (payload) =>
      apiClient.post("/api/v1/salary-structures", payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salary-structures"] });
      setOpen(false);
      setSelectedEmployee(null);
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Salary Structures</h1>

        <Button
          disabled={!selectedEmployee}
          onClick={() => setOpen(true)}
        >
          New Structure
        </Button>
      </div>

      <SalaryStructureTable
        data={structures}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
        loading={isLoading}
      />

      <SalaryStructureDrawer
        open={open}
        onClose={() => setOpen(false)}
        employee={selectedEmployee}
        loading={createSalaryMutation.isPending}
        onSubmit={(values) =>
          createSalaryMutation.mutate({
            ...values,
            employee_id: selectedEmployee.id,
            is_active: true,
          })
        }
      />
    </div>
  );
}
