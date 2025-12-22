import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { format } from "date-fns";

export function useAttendanceLock(month) {
  return useQuery({
    queryKey: ["attendance-lock", format(month, "yyyy-MM")],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/attendance-locks?month=${format(month, "yyyy-MM")}`
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}
