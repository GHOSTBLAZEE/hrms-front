import apiClient from "./apiClient";
export const getDepartmentsApi = async () => {
  const res = await apiClient.get("/departments");
  return res.data; // ✅ IMPORTANT
};
export const createDepartmentApi=(d)=>apiClient.post("/departments",d);
export const updateDepartmentApi=(id,d)=>apiClient.put(`/departments/${id}`,d);
export const deleteDepartmentApi=(id)=>apiClient.delete(`/departments/${id}`);
