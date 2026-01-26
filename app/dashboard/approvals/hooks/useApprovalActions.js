"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovalActions() {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: async ({ approvalId, remarks }) => {
      await apiClient.post(
        `/api/v1/approvals/${approvalId}/approve`,
        { remarks }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: ["leaves"] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  const reject = useMutation({
    mutationFn: async ({ approvalId, reason }) => {
      if (!reason) {
        throw new Error("Reject reason is required");
      }

      await apiClient.post(
        `/api/v1/approvals/${approvalId}/reject`,
        { reason }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: ["leaves"] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  return { approve, reject };
}
