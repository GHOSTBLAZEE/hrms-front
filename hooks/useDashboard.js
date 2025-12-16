import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "@/lib/dashboardApi";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
  });
}
