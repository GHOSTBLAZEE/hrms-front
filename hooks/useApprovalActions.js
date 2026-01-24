import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovalActions(type = "leave") {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/${type}s/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: [`${type}s`] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }) =>
      apiClient.post(`/api/v1/${type}s/${id}/reject`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: [`${type}s`] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  return { approve, reject };
}
