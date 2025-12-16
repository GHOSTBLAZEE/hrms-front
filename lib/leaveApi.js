import apiClient from "./apiClient";

export const getLeavesApi = () => apiClient.get("/leaves");
export const applyLeaveApi = (data) => apiClient.post("/leaves", data);
export const approveLeaveApi = (id) => apiClient.post(`/leaves/${id}/approve`);
export const cancelLeaveApi = (id) => apiClient.post(`/leaves/${id}/cancel`);
