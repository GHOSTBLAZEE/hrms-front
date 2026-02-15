import { leaveApi } from "@/lib/leaveApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_CONFIGS } from "@/config/queryConfig";

/* =========================================================
 | Read Queries
 |========================================================= */

export function useLeaveBalances(employeeId) {
  return useQuery({
    queryKey: ["leave-balances", employeeId],
    queryFn: async () => {
      const response = await leaveApi.balances(employeeId);
      return response.data;
    },
    enabled: !!employeeId,
    ...QUERY_CONFIGS.INFREQUENT,
  });
}

export function useEmployeeLeaves(employeeId) {
  return useQuery({
    queryKey: ["employee-leaves", employeeId],
    queryFn: async () => {
      const response = await leaveApi.employeeLeaves(employeeId);
      return response.data;
    },
    enabled: !!employeeId,
    ...QUERY_CONFIGS.FRESH,
  });
}

export function useLeaveApprovals(status = "pending") {
  return useQuery({
    queryKey: ["leave-approvals", status],
    queryFn: async () => {
      const response = await leaveApi.listApprovals(status);
      return response.data;
    },
    ...QUERY_CONFIGS.FRESH,
  });
}

/* =========================================================
 | Mutations
 |========================================================= */

function useInvalidateLeaveQueries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
    queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
    queryClient.invalidateQueries({ queryKey: ["leave-approvals"] });
    queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
    queryClient.invalidateQueries({ queryKey: ["my-leave-balances"] });
  };
}

export function useLeaveActions() {
  const queryClient = useQueryClient();
  const invalidateAll = useInvalidateLeaveQueries();

  return {
    apply: useMutation({
      mutationFn: async (payload) => {
        const response = await leaveApi.apply(payload);
        return response.data;
      },
      onSuccess: () => {
        invalidateAll();
        toast.success("Leave application submitted successfully!");
      },
      onError: () => {
        toast.error("Failed to submit leave application.");
      },
    }),

    cancel: useMutation({
      mutationFn: async (leaveId) => {
        const response = await leaveApi.cancel(leaveId);
        return response.data;
      },
      onSuccess: () => {
        invalidateAll();
        toast.success("Leave cancelled successfully.");
      },
      onError: () => {
        toast.error("Failed to cancel leave.");
      },
    }),

    approve: useMutation({
      mutationFn: async ({ leaveId, remarks }) => {
        const response = await leaveApi.approve(leaveId, { remarks });
        return response.data;
      },
      onSuccess: () => {
        invalidateAll();
        toast.success("Leave approved.");
      },
      onError: () => {
        toast.error("Failed to approve leave.");
      },
    }),

    reject: useMutation({
      mutationFn: async ({ leaveId, reason }) => {
        const response = await leaveApi.reject(leaveId, { reason });
        return response.data;
      },
      onSuccess: () => {
        invalidateAll();
        toast.success("Leave rejected.");
      },
      onError: () => {
        toast.error("Failed to reject leave.");
      },
    }),
  };
}