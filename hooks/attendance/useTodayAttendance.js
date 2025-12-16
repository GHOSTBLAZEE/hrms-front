import { useQuery } from "@tanstack/react-query";
import { getTodayAttendanceApi } from "@/lib/attendanceApi";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance-today"],
    queryFn: getTodayAttendanceApi,
  });
}
