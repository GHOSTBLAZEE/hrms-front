import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeavesApi,
  applyLeaveApi,
  approveLeaveApi,
  cancelLeaveApi,
} from "@/lib/leaveApi";
import { toast } from "sonner";

export function useLeaves() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["leaves"],
    queryFn: getLeavesApi,
  });

  const apply = useMutation({
    mutationFn: applyLeaveApi,
    onSuccess: () => {
      toast.success("Leave applied");
      qc.invalidateQueries(["leaves"]);
    },
  });

  const approve = useMutation({
    mutationFn: approveLeaveApi,
    onSuccess: () => {
      toast.success("Leave approved");
      qc.invalidateQueries(["leaves"]);
    },
  });

  const cancel = useMutation({
    mutationFn: cancelLeaveApi,
    onSuccess: () => {
      toast.success("Leave cancelled");
      qc.invalidateQueries(["leaves"]);
    },
  });

  return {
    ...query,
    apply,
    approve,
    cancel,
  };
}
