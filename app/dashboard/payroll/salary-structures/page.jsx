"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

import SalaryStructureTable from "./SalaryStructureTable";
import SalaryStructureDrawer from "./SalaryStructureDrawer";
import { Button } from "@/components/ui/button";

export default function SalaryStructuresPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ Correct endpoint
  const { data: structures = [], refetch, isLoading } = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await apiClient.get("api/v1/salary-structures");
      return res.data;
    },
  });
console.log(structures);

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      await apiClient.post("/api/v1/salary-structures", payload);
    },
    onSuccess: () => {
      setOpen(false);
      setSelectedEmployee(null);
      refetch();
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
        onSubmit={(values) => {
          createMutation.mutate({
            ...values,
            employee_id: selectedEmployee.id,
          });
        }}
        loading={createMutation.isPending}
      />
    </div>
  );
}
