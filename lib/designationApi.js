import apiClient from "./apiClient";
export const getDesignationsApi=()=>apiClient.get("/designations");
export const createDesignationApi=(d)=>apiClient.post("/designations",d);
export const updateDesignationApi=(id,d)=>apiClient.put(`/designations/${id}`,d);
export const deleteDesignationApi=(id)=>apiClient.delete(`/designations/${id}`);
