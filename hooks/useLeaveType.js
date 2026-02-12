import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/leaveTypeApi";
import { toast } from "sonner";
import { QUERY_CONFIGS } from "@/config/queryConfig";

export function useLeaveTypes() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["leavetypes"],
    queryFn: api.getLeaveTypesApi,
    ...QUERY_CONFIGS.STATIC,
  });

  const create = useMutation({
    mutationFn: api.createLeaveTypeApi,
    onSuccess: () => {
      toast.success("LeaveType created");
      qc.invalidateQueries(["leavetypes"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateLeaveTypeApi(id, data),
    onSuccess: () => {
      toast.success("LeaveType updated");
      qc.invalidateQueries(["leavetypes"]);
    },
  });

  const remove = useMutation({
    mutationFn: api.deleteLeaveTypeApi,
    onSuccess: () => {
      toast.success("LeaveType deleted");
      qc.invalidateQueries(["leavetypes"]);
    },
  });

  return { ...q, create, update, remove };
}
