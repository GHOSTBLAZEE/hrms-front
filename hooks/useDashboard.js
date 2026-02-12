import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "@/lib/dashboardApi";
import { QUERY_CONFIGS } from "@/config/queryConfig";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
    ...QUERY_CONFIGS.MODERATE,
  });
}
