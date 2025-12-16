import apiClient from "./apiClient";
export const getLeaveTypesApi=()=>apiClient.get("/leave-types");
export const createLeaveTypeApi=(d)=>apiClient.post("/leave-types",d);
export const updateLeaveTypeApi=(id,d)=>apiClient.put(`/leave-types/${id}`,d);
export const deleteLeaveTypeApi=(id)=>apiClient.delete(`/leave-types/${id}`);
