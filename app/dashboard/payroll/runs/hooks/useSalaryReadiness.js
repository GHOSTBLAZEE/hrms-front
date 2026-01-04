import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useSalaryReadiness() {
  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/employees");
      return res.data.data ?? res.data;
    },
  });

  const salaryQuery = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/salary-structures");
      return res.data;
    },
  });

  if (employeesQuery.isLoading || salaryQuery.isLoading) {
    return { isLoading: true };
  }

  const withSalary = new Set(
    salaryQuery.data.map((s) => s.employee_id)
  );

  const missing = employeesQuery.data.filter(
    (e) => !withSalary.has(e.id)
  );

  return {
    isLoading: false,
    missing,
  };
}
