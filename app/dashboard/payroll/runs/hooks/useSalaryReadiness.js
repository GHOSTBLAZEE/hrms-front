"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useSalaryReadiness() {
  /* -------------------------------
   | Employees
   |--------------------------------*/
  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/employees");
      return res.data;
    },
    staleTime: 60_000,
  });

  /* -------------------------------
   | Salary Structures
   |--------------------------------*/
  const salaryQuery = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/salary-structures");
      return res.data;
    },
    staleTime: 60_000,
  });

  /* -------------------------------
   | Loading guard
   |--------------------------------*/
  if (employeesQuery.isLoading || salaryQuery.isLoading) {
    return { isLoading: true };
  }

  /* -------------------------------
   | Normalize API shapes
   |--------------------------------*/
  const employees = Array.isArray(employeesQuery.data)
    ? employeesQuery.data
    : employeesQuery.data?.data ?? [];

  const salaryStructures = Array.isArray(salaryQuery.data)
    ? salaryQuery.data
    : salaryQuery.data?.data ?? [];

  /* -------------------------------
   | Employees with salary
   |--------------------------------*/
  const withSalary = new Set(
    salaryStructures.map((s) => s.employee_id)
  );

  /* -------------------------------
   | Missing salary structures
   |--------------------------------*/
  const missing = employees.filter(
    (e) => !withSalary.has(e.id)
  );

  return {
    isLoading: false,
    missing,
  };
}
