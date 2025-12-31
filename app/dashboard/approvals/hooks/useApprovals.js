import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Normalize leave approvals
 */
function normalizeLeave(leave) {
  return {
    id: leave.id,
    type: "leave",
    title: "Leave Request",
    employee: {
      id: leave.employee.id,
      name: leave.employee.user.name,
      employee_code: leave.employee.employee_code,
    },
    submitted_at: leave.created_at,
    status: leave.status,
    action_url: `/dashboard/leaves/${leave.id}`,
    audit_url: `/dashboard/reports/audit_logs?entity=leave&entity_id=${leave.id}`,
    meta: leave,
  };
}

/**
 * Normalize attendance correction approvals
 */
function normalizeAttendance(correction) {
  return {
    id: correction.id,
    type: "attendance",
    title: "Attendance Correction",
    employee: {
      id: correction.employee.id,
      name: correction.employee.user.name,
      employee_code: correction.employee.employee_code,
    },
    submitted_at: correction.created_at,
    status: correction.status,
    action_url: `/dashboard/attendance/corrections`,
    audit_url: `/dashboard/reports/audit_logs?entity=attendance_correction&entity_id=${correction.id}`,
    meta: correction,
  };
}

export function useApprovals({ status = "pending", type = "all" }) {
  return useQuery({
    queryKey: ["approvals", status, type],
    queryFn: async () => {
      const requests = [];

      // Fetch leave approvals
      if (type === "all" || type === "leave") {
        const leaveRes = await apiClient.get(
          "/api/v1/leaves/approvals",
          { params: { status } }
        );

        leaveRes.data.forEach((leave) => {
          requests.push(normalizeLeave(leave));
        });
      }

      // Fetch attendance correction approvals
      if (type === "all" || type === "attendance") {
        const attRes = await apiClient.get(
          "/api/v1/attendance/corrections/approvals",
          { params: { status } }
        );

        attRes.data.forEach((correction) => {
          requests.push(normalizeAttendance(correction));
        });
      }

      // Sort newest first
      return requests.sort(
        (a, b) =>
          new Date(b.submitted_at) -
          new Date(a.submitted_at)
      );
    },
    staleTime: 30_000,
  });
}
