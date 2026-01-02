import apiClient from "./apiClient";

export const getTodayAttendanceApi = () =>
  apiClient.get("/api/v1/attendance/today");

export const getAttendanceMonthApi = (month) =>
  apiClient.get(`/api/v1/attendance/month?month=${month}`);

export const punchAttendanceApi = () =>
  apiClient.post("/api/v1/attendance/punch");
