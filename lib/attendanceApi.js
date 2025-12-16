import apiClient from "./apiClient";

export const getTodayAttendanceApi = () =>
  apiClient.get("/attendance/today");

export const getAttendanceMonthApi = (month) =>
  apiClient.get(`/attendance/month?month=${month}`);

export const punchAttendanceApi = () =>
  apiClient.post("/attendance/punch");
