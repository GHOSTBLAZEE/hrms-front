"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Fetch employee leave history
 */
async function fetchEmployeeLeaves(employeeId) {
  const res = await apiClient.get(
    `/api/v1/employees/${employeeId}/leaves`
  );

  return res.data;
}

/**
 * Employee leave history (READ-ONLY)
 */
export function useEmployeeLeaves(employeeId) {
  return useQuery({
    queryKey: ["employee-leaves", employeeId],
    queryFn: () => fetchEmployeeLeaves(employeeId),
    enabled: !!employeeId,
  });
}
