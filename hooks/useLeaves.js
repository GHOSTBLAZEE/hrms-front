import { leaveApi } from '@/lib/leaveApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* =========================================================
 | Configuration
 |========================================================= */
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: true,
  retry: 1,
};

/* =========================================================
 | Read Queries
 |========================================================= */

/**
 * Get leave balances for an employee
 */
export function useLeaveBalances(employeeId) {
  return useQuery({
    queryKey: ['leave-balances', employeeId],
    queryFn: async () => {
      const response = await leaveApi.balances(employeeId);
      return response.data;
    },
    enabled: !!employeeId,
    ...QUERY_CONFIG,
    staleTime: 2 * 60 * 1000, // Balance changes less frequently - 2 min
  });
}

/**
 * Get all leaves for a specific employee
 */
export function useEmployeeLeaves(employeeId) {
  return useQuery({
    queryKey: ['employee-leaves', employeeId],
    queryFn: async () => {
      const response = await leaveApi.employeeLeaves(employeeId);
      return response.data;
    },
    enabled: !!employeeId,
    ...QUERY_CONFIG,
  });
}

/**
 * Get leave approvals (for managers/approvers)
 */
export function useLeaveApprovals(status = 'pending') {
  return useQuery({
    queryKey: ['leave-approvals', status],
    queryFn: async () => {
      const response = await leaveApi.listApprovals(status);
      return response.data;
    },
    ...QUERY_CONFIG,
    staleTime: 1 * 60 * 1000, // Approvals need fresher data - 1 min
  });
}

/* =========================================================
 | Write Mutations
 |========================================================= */

/**
 * Centralized cache invalidation
 */
function useInvalidateLeaveQueries() {
  const queryClient = useQueryClient();

  return () => {
    // Invalidate all leave-related queries
    queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
    queryClient.invalidateQueries({ queryKey: ['employee-leaves'] });
    queryClient.invalidateQueries({ queryKey: ['leave-approvals'] });
    queryClient.invalidateQueries({ queryKey: ['my-leaves'] }); // ✅ Added
    queryClient.invalidateQueries({ queryKey: ['my-leave-balances'] }); // ✅ Added
  };
}

/**
 * Leave actions with optimized mutations
 */
export function useLeaveActions() {
  const queryClient = useQueryClient();
  const invalidateAll = useInvalidateLeaveQueries();

  return {
    /**
     * Apply for leave
     */
    apply: useMutation({
      mutationFn: async (payload) => {
        const response = await leaveApi.apply(payload);
        return response.data;
      },
      onSuccess: (data) => {
        invalidateAll();
        toast.success('Leave application submitted successfully!', {
          description: 'Your request has been sent for approval.',
        });
      },
      onError: (error) => {
        const message = error?.response?.data?.message || 'Failed to apply for leave';
        toast.error('Leave Application Failed', {
          description: message,
        });
      },
    }),

    /**
     * Approve leave (with optimistic update)
     */
    approve: useMutation({
      mutationFn: async ({ leaveId, remarks }) => {
        const response = await leaveApi.approve(leaveId, remarks);
        return response.data;
      },
      // ✅ Optimistic update - UI updates before server responds
      onMutate: async ({ leaveId }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['leave-approvals'] });

        // Snapshot previous value
        const previousApprovals = queryClient.getQueryData(['leave-approvals', 'pending']);

        // Optimistically update
        queryClient.setQueryData(['leave-approvals', 'pending'], (old) => {
          if (!old) return old;
          return old.filter(leave => leave.id !== leaveId);
        });

        return { previousApprovals };
      },
      onSuccess: (data) => {
        invalidateAll();
        toast.success('Leave Approved', {
          description: 'The leave request has been approved successfully.',
        });
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousApprovals) {
          queryClient.setQueryData(['leave-approvals', 'pending'], context.previousApprovals);
        }
        const message = error?.response?.data?.message || 'Failed to approve leave';
        toast.error('Approval Failed', {
          description: message,
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: ['leave-approvals'] });
      },
    }),

    /**
     * Reject leave (with optimistic update)
     */
    reject: useMutation({
      mutationFn: async ({ leaveId, remarks }) => {
        const response = await leaveApi.reject(leaveId, remarks);
        return response.data;
      },
      // ✅ Optimistic update
      onMutate: async ({ leaveId }) => {
        await queryClient.cancelQueries({ queryKey: ['leave-approvals'] });
        const previousApprovals = queryClient.getQueryData(['leave-approvals', 'pending']);

        queryClient.setQueryData(['leave-approvals', 'pending'], (old) => {
          if (!old) return old;
          return old.filter(leave => leave.id !== leaveId);
        });

        return { previousApprovals };
      },
      onSuccess: (data) => {
        invalidateAll();
        toast.success('Leave Rejected', {
          description: 'The leave request has been rejected.',
        });
      },
      onError: (error, variables, context) => {
        if (context?.previousApprovals) {
          queryClient.setQueryData(['leave-approvals', 'pending'], context.previousApprovals);
        }
        const message = error?.response?.data?.message || 'Failed to reject leave';
        toast.error('Rejection Failed', {
          description: message,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['leave-approvals'] });
      },
    }),

    /**
     * Cancel leave (with optimistic update)
     */
    cancel: useMutation({
      mutationFn: async (leaveId) => {
        const response = await leaveApi.cancel(leaveId);
        return response.data;
      },
      // ✅ Optimistic update
      onMutate: async (leaveId) => {
        await queryClient.cancelQueries({ queryKey: ['my-leaves'] });
        await queryClient.cancelQueries({ queryKey: ['employee-leaves'] });

        const previousMyLeaves = queryClient.getQueryData(['my-leaves']);
        const previousEmployeeLeaves = queryClient.getQueriesData({ queryKey: ['employee-leaves'] });

        // Update my-leaves
        queryClient.setQueryData(['my-leaves'], (old) => {
          if (!old) return old;
          return old.map(leave => 
            leave.id === leaveId 
              ? { ...leave, status: 'cancelled' }
              : leave
          );
        });

        return { previousMyLeaves, previousEmployeeLeaves };
      },
      onSuccess: (data) => {
        invalidateAll();
        toast.success('Leave Cancelled', {
          description: 'Your leave request has been cancelled successfully.',
        });
      },
      onError: (error, variables, context) => {
        // Rollback
        if (context?.previousMyLeaves) {
          queryClient.setQueryData(['my-leaves'], context.previousMyLeaves);
        }
        const message = error?.response?.data?.message || 'Failed to cancel leave';
        toast.error('Cancellation Failed', {
          description: message,
        });
      },
      onSettled: () => {
        invalidateAll();
      },
    }),
  };
}

/* =========================================================
 | Utility Hooks
 |========================================================= */

/**
 * Prefetch leave data for better UX
 */
export function usePrefetchLeaveData(employeeId) {
  const queryClient = useQueryClient();

  return () => {
    if (!employeeId) return;

    // Prefetch balances
    queryClient.prefetchQuery({
      queryKey: ['leave-balances', employeeId],
      queryFn: () => leaveApi.balances(employeeId).then(r => r.data),
      staleTime: 2 * 60 * 1000,
    });

    // Prefetch leave history
    queryClient.prefetchQuery({
      queryKey: ['employee-leaves', employeeId],
      queryFn: () => leaveApi.employeeLeaves(employeeId).then(r => r.data),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Get combined leave status (useful for dashboard)
 */
export function useLeaveStatus(employeeId) {
  const { data: balances, isLoading: balancesLoading } = useLeaveBalances(employeeId);
  const { data: leaves, isLoading: leavesLoading } = useEmployeeLeaves(employeeId);

  return {
    balances,
    leaves,
    isLoading: balancesLoading || leavesLoading,
    pendingLeaves: leaves?.filter(l => l.status === 'pending') || [],
    approvedLeaves: leaves?.filter(l => l.status === 'approved') || [],
  };
}