import apiClient from "./apiClient";
export const getDepartmentsApi=()=>apiClient.get("/departments");
export const createDepartmentApi=(d)=>apiClient.post("/departments",d);
export const updateDepartmentApi=(id,d)=>apiClient.put(`/departments/${id}`,d);
export const deleteDepartmentApi=(id)=>apiClient.delete(`/departments/${id}`);
