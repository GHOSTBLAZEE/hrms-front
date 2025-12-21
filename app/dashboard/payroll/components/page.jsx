"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SalaryComponentTable from "./SalaryComponentTable";
import SalaryComponentForm from "./SalaryComponentForm";
import { Button } from "@/components/ui/button";

export default function SalaryComponentsPage() {
  const [open, setOpen] = useState(false);

  const { data = [], refetch } = useQuery({
    queryKey: ["salary-components"],
    queryFn: () =>
      fetch("/api/v1/payroll/components", {
        credentials: "include",
      }).then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      fetch("/api/v1/payroll/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
          Salary Components
        </h1>
        <Button onClick={() => setOpen(true)}>
          Add Component
        </Button>
      </div>

      <SalaryComponentTable data={data} />

      {open && (
        <SalaryComponentForm
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            createMutation.mutate(
              Object.fromEntries(formData)
            );
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
