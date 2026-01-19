import { LeaveStatus } from "../constants/Leave-status";



export function canApproveLeave(leave, can) {
  return (
    leave.status === LeaveStatus.PENDING &&
    can('approve leave')
  );
}

export function canRejectLeave(leave, can) {
  return (
    leave.status === LeaveStatus.PENDING &&
    can('reject leave')
  );
}

export function canCancelLeave(leave, userId, can) {
  if (leave.status !== LeaveStatus.APPROVED) return false;

  return (
    leave.employee_id === userId ||
    can('approve leave')
  );
}
