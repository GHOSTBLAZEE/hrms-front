import apiClient from '@/lib/apiClient';

export const leaveApi = {
  listApprovals: (status = 'pending') =>
    apiClient.get(`/leaves/approvals?status=${status}`),

  apply: (data) =>
    apiClient.post('/leaves', data),

  approve: (id) =>
    apiClient.post(`/leaves/${id}/approve`),

  reject: (id) =>
    apiClient.post(`/leaves/${id}/reject`),

  cancel: (id) =>
    apiClient.post(`/leaves/${id}/cancel`),

  preview: (data) =>
    apiClient.post('/leaves/preview', data),

  balances: (employeeId) =>
    apiClient.get(`/employees/${employeeId}/leave-balances`),

  employeeLeaves: (employeeId) =>
    apiClient.get(`/employees/${employeeId}/leaves`),
};
