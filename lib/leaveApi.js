import apiClient from "@/lib/apiClient";

export const leaveApi = {
  /* ================= LEAVES ================= */

  listApprovals: (status = "pending") =>
    apiClient.get(`api/v1/leaves/approvals?status=${status}`),

  apply: (data) =>
    apiClient.post("api/v1/leaves", data),

  approve: (id) =>
    apiClient.post(`api/v1/leaves/${id}/approve`),

  reject: (id) =>
    apiClient.post(`api/v1/leaves/${id}/reject`),

  cancel: (id) =>
    apiClient.post(`api/v1/leaves/${id}/cancel`),

  preview: (data) =>
    apiClient.post("api/v1/leaves/preview", data),

  balances: (employeeId) =>
    apiClient.get(`api/v1/employees/${employeeId}/leave-balances`),

  employeeLeaves: (employeeId) =>
    apiClient.get(`api/v1/employees/${employeeId}/leaves`),

  /* ================= LEAVE TYPES (SETTINGS) ================= */

  listTypes: ({ includeInactive } = {}) =>
    apiClient.get("api/v1/leave-types", {
      params: {
        include_inactive: includeInactive ? 1 : 0,
      },
    }),

  createType: (data) =>
    apiClient.post("api/v1/leave-types", data),

  updateType: ({ id, ...data }) =>
    apiClient.put(`api/v1/leave-types/${id}`, data),

  deleteType: (id) =>
    apiClient.delete(`api/v1/leave-types/${id}`),
};
