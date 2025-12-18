import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getAttendanceMonthApi } from "@/lib/attendanceApi";

export function useAttendanceMonth(date) {
  const month = format(date, "yyyy-MM");

  return useQuery({
    queryKey: ["attendance-month", month],
    queryFn: async () => {
      const res = await getAttendanceMonthApi(month);

      // 🔑 IMPORTANT: unwrap Laravel resource response
      return Array.isArray(res) ? res : res.data;
    },
  });
}
