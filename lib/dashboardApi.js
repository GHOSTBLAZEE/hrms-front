// lib/dashboardApi.js
import apiClient from "./apiClient";

export const getDashboardApi = async () => {
  const res = await apiClient.get("/dashboard");
  return res.data;
};
