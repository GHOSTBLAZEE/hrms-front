import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useAttendanceLockTimeline() {
  return useQuery({
    queryKey: ["attendance-lock-timeline"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/api/v1/attendance-locks/timeline"
      );
      return res.data;
    },
    staleTime: 60_000,
  });
}
