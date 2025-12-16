import apiClient from "./apiClient";
export const getLocationsApi = () => apiClient.get("/locations");
export const createLocationApi = (d) => apiClient.post("/locations", d);
export const updateLocationApi = (id, d) =>
  apiClient.put(`/locations/${id}`, d);
export const deleteLocationApi = (id) => apiClient.delete(`/locations/${id}`);
