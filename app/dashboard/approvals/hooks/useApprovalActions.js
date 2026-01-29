"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useApprovalActions() {
  const qc = useQueryClient();

  /* --------------------------------
   | Helpers
   |---------------------------------*/

  // 🔥 ONLY remove from PENDING optimistically
  const optimisticRemoveFromPending = (approvalIds) => {
    const key = ["approvals", { status: "pending" }];

    const prev = qc.getQueryData(key);

    if (Array.isArray(prev)) {
      qc.setQueryData(
        key,
        prev.filter(
          (row) => !approvalIds.includes(row.id)
        )
      );
    }

    return { key, prev };
  };

  const rollback = (snapshot) => {
    if (!snapshot?.key) return;
    qc.setQueryData(snapshot.key, snapshot.prev);
  };

  const invalidateAllApprovals = () => {
    qc.invalidateQueries({
      queryKey: ["approvals"],
      exact: false,
    });
  };

  /* --------------------------------
   | Approve
   |---------------------------------*/

  const approve = useMutation({
    mutationFn: ({ approvalId }) =>
      apiClient.post(
        `/api/v1/approvals/${approvalId}/approve`
      ),

    onMutate: async ({ approvalId }) => {
      await qc.cancelQueries({
        queryKey: ["approvals"],
        exact: false,
      });

      const snapshot =
        optimisticRemoveFromPending([approvalId]);

      return { snapshot };
    },

    onError: (_err, _vars, ctx) => {
      rollback(ctx?.snapshot);
    },

    onSuccess: () => {
      // 👈 ensure Approved tab updates
      qc.invalidateQueries({
        queryKey: ["approvals", { status: "approved" }],
      });
    },

    onSettled: () => {
      invalidateAllApprovals();
      qc.invalidateQueries({ queryKey: ["leaves"] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  /* --------------------------------
   | Reject
   |---------------------------------*/

  const reject = useMutation({
    mutationFn: ({ approvalId, reason }) =>
      apiClient.post(
        `/api/v1/approvals/${approvalId}/reject`,
        { reason }
      ),

    onMutate: async ({ approvalId }) => {
      await qc.cancelQueries({
        queryKey: ["approvals"],
        exact: false,
      });

      const snapshot =
        optimisticRemoveFromPending([approvalId]);

      return { snapshot };
    },

    onError: (_err, _vars, ctx) => {
      rollback(ctx?.snapshot);
    },

    onSuccess: () => {
      // 👈 ensure Rejected tab updates
      qc.invalidateQueries({
        queryKey: ["approvals", { status: "rejected" }],
      });
    },

    onSettled: () => {
      invalidateAllApprovals();
      qc.invalidateQueries({ queryKey: ["leaves"] });
      qc.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  return { approve, reject };
}
