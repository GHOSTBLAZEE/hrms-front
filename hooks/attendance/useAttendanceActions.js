import { useMutation, useQueryClient } from "@tanstack/react-query";
import { punchAttendanceApi } from "@/lib/attendanceApi";
import { toast } from "sonner";

export function useAttendanceActions() {
  const qc = useQueryClient();

  const punch = useMutation({
    mutationFn: punchAttendanceApi,
    onSuccess: () => {
      toast.success("Attendance updated");
      qc.invalidateQueries(["attendance-today"]);
      qc.invalidateQueries({ queryKey: ["attendance-month"] });
    },
  });

  return {
    punch: punch.mutateAsync,
    isPunching: punch.isPending,
  };
}
