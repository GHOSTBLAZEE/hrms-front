"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Normalize unified approval request
 */
function normalizeApproval(approval) {
  const entity = approval.approvable;

  let title = "Approval Request";
  let actionUrl = "#";
  let auditEntity = null;

  switch (approval.approvable_type) {
    case "leave":
      title = "Leave Request";
      actionUrl = `/dashboard/leaves/${entity.id}`;
      auditEntity = "leave";
      break;

    case "attendance_correction":
      title = "Attendance Correction";
      actionUrl = `/dashboard/attendance/corrections`;
      auditEntity = "attendance_correction";
      break;

    case "attendance_unlock":
      title = "Attendance Unlock Request";
      actionUrl = `/dashboard/attendance/locks`;
      auditEntity = "attendance_unlock";
      break;
  }

  return {
    id: approval.id, // 🔑 approval id
    type: approval.approvable_type,
    title,
    employee: entity?.employee
      ? {
          id: entity.employee.id,
          name: entity.employee.user.name,
          employee_code: entity.employee.employee_code,
        }
      : null,
    submitted_at: approval.submitted_at,
    status: approval.status,
    action_url: actionUrl,
    audit_url: auditEntity
      ? `/dashboard/reports/audit_logs?entity=${auditEntity}&entity_id=${entity.id}`
      : null,
    meta: approval,
  };
}

export function useApprovals({ status = "pending" }) {
  return useQuery({
    queryKey: ["approvals", status],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/approvals/inbox",
        { params: { status } }
      );

      return data
        .map(normalizeApproval)
        .sort(
          (a, b) =>
            new Date(b.submitted_at) -
            new Date(a.submitted_at)
        );
    },
    staleTime: 30_000,
  });
}
