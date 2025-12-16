import apiClient from "./apiClient";
export const getCompaniesApi=()=>apiClient.get("/companies");
export const createCompanyApi=(d)=>apiClient.post("/companies",d);
export const updateCompanyApi=(id,d)=>apiClient.put(`/companies/${id}`,d);
export const deleteCompanyApi=(id)=>apiClient.delete(`/companies/${id}`);
