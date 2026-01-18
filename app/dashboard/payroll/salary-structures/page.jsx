"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

import SalaryStructureTable from "./SalaryStructureTable";
import SalaryStructureDrawer from "./SalaryStructureDrawer";
import { Button } from "@/components/ui/button";

/* =========================================================
 | Salary Structures Page
 |========================================================= */
export default function SalaryStructuresPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- Highlight handling ---------------- */

  const highlightIds = useMemo(() => {
    const raw = searchParams.get("highlight");
    if (!raw) return [];

    return raw
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
  }, [searchParams]);

  /* ---------------- Local state ---------------- */

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  /* ---------------- Fetch salary structures ---------------- */

  const { data: structures = [], isLoading } = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/salary-structures");
      return res.data;
    },
  });

  /* ---------------- Auto-select highlighted employee ---------------- */

  useEffect(() => {
    if (!highlightIds.length || !structures.length) return;

    const firstMatch = structures.find((row) =>
      highlightIds.includes(row.employee_id)
    );

    if (firstMatch) {
      setSelectedEmployee(firstMatch.employee);
      setOpen(true);
    }
  }, [highlightIds, structures]);

  /* ---------------- Create salary structure ---------------- */

  const createSalaryMutation = useMutation({
    mutationFn: async (payload) =>
      apiClient.post("/api/v1/salary-structures", payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salary-structures"] });

      // Close drawer & reset
      setOpen(false);
      setSelectedEmployee(null);

      // Clear highlight from URL
      router.replace("/dashboard/payroll/salary-structures");
    },
  });

  /* ---------------- Render ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Salary Structures
        </h1>

        <Button
          disabled={!selectedEmployee}
          onClick={() => setOpen(true)}
        >
          New Structure
        </Button>
      </div>

      {/* Table */}
      <SalaryStructureTable
        data={structures}
        selectedEmployee={selectedEmployee}
        highlightedEmployeeIds={highlightIds} // 👈 NEW
        onSelectEmployee={setSelectedEmployee}
        loading={isLoading}
      />

      {/* Drawer */}
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
