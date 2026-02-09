import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Hook to fetch the current user's employee profile
 * Automatically gets the employee_id from the authenticated user
 */
export function useMyProfile() {
  // Get current user
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/me");
      return res.data;
    },
    retry: false,
  });

  const user = authData?.user;
  const employeeId = user?.employee_id;

  // Fetch employee profile (only if we have employee_id)
  const { 
    data: employee, 
    isLoading: isLoadingEmployee,
    error 
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}`);
      return response.data?.data;
    },
    enabled: !!employeeId, // Only fetch if employee_id exists
  });

  return {
    user,
    employee,
    employeeId,
    isLoading: isLoadingAuth || isLoadingEmployee,
    error,
    hasEmployeeProfile: !!employeeId,
  };
}