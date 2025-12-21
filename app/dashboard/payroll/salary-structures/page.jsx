"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SalaryStructureTable from "./SalaryStructureTable";
import SalaryStructureDrawer from "./SalaryStructureDrawer";
import { Button } from "@/components/ui/button";

export default function SalaryStructuresPage() {
  const [selectedEmployee, setSelectedEmployee] =
    useState(null);
  const [open, setOpen] = useState(false);

  const { data: structures = [], refetch } = useQuery({
    queryKey: ["salary-structures"],
    queryFn: () =>
      fetch("/api/v1/payroll/salary-structures", {
        credentials: "include",
      }).then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      fetch("/api/v1/payroll/salary-structures", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      setOpen(false);
      refetch();
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Salary Structures
        </h1>
        <Button onClick={() => setOpen(true)}>
          New Structure
        </Button>
      </div>

      <SalaryStructureTable
        data={structures}
        onSelect={setSelectedEmployee}
      />

      {open && (
        <SalaryStructureDrawer
          open={open}
          onClose={() => setOpen(false)}
          employee={selectedEmployee}
          components={[]}
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(
              new FormData(e.target)
            );
            createMutation.mutate(data);
          }}
        />
      )}
    </div>
  );
}
