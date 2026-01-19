import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '@/lib/api/leaves';

export function useLeaveBalances(employeeId) {
  return useQuery({
    queryKey: ['leave-balances', employeeId],
    queryFn: () => leaveApi.balances(employeeId).then(r => r.data),
    enabled: !!employeeId,
  });
}

export function useEmployeeLeaves(employeeId) {
  return useQuery({
    queryKey: ['employee-leaves', employeeId],
    queryFn: () => leaveApi.employeeLeaves(employeeId).then(r => r.data),
    enabled: !!employeeId,
  });
}

export function useLeaveApprovals(status = 'pending') {
  return useQuery({
    queryKey: ['leave-approvals', status],
    queryFn: () => leaveApi.listApprovals(status).then(r => r.data),
  });
}

export function useLeaveActions() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['leave-balances'] });
    qc.invalidateQueries({ queryKey: ['employee-leaves'] });
    qc.invalidateQueries({ queryKey: ['leave-approvals'] });
  };

  return {
    approve: useMutation({
      mutationFn: leaveApi.approve,
      onSuccess: invalidate,
    }),

    reject: useMutation({
      mutationFn: leaveApi.reject,
      onSuccess: invalidate,
    }),

    cancel: useMutation({
      mutationFn: leaveApi.cancel,
      onSuccess: invalidate,
    }),
  };
}
