// frontend/lib/authApi.js

import apiClient from "./apiClient";

const BASE_URL = "http://localhost";

export const getCsrfCookie = async () => {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

export const loginApi = async (payload) => {
  await getCsrfCookie();
  return apiClient.post("/login", payload);
};

export const logoutApi = async () => {
  return apiClient.post("/logout");
};

export const getMeApi = async () => {
  const res = await apiClient.get("/me");

  // 🔑 UNWRAP Laravel resource
  return res?.data ?? {};
};
