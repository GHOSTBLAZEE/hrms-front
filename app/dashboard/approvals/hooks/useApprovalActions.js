import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovalActions() {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: async ({ type, id }) => {
      if (type === "leave") {
        return apiClient.post(`/api/v1/leaves/${id}/approve`);
      }

      if (type === "attendance") {
        return apiClient.post(
          `/api/v1/attendance/corrections/${id}/approve`
        );
      }

      throw new Error("Unknown approval type");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
    },
  });

  const reject = useMutation({
    mutationFn: async ({ type, id, reason }) => {
      if (!reason) {
        throw new Error("Reject reason is required");
      }

      if (type === "leave") {
        return apiClient.post(
          `/api/v1/leaves/${id}/reject`,
          { reason }
        );
      }

      if (type === "attendance") {
        return apiClient.post(
          `/api/v1/attendance/corrections/${id}/reject`,
          { reason }
        );
      }

      throw new Error("Unknown approval type");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
    },
  });

  return { approve, reject };
}
