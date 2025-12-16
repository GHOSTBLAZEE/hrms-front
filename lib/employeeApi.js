import apiClient from "./apiClient";

export const getEmployeesApi = () => apiClient.get("/employees");
export const createEmployeeApi = (data) => apiClient.post("/employees", data);
export const updateEmployeeApi = (id, data) =>
  apiClient.put(`/employees/${id}`, data);
export const deleteEmployeeApi = (id) => apiClient.delete(`/employees/${id}`);
