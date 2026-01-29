import axios from "axios";

function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://hrms.test", // ✅ Use env var
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

// 🔐 FORCE SEND XSRF HEADER ON EVERY REQUEST
apiClient.interceptors.request.use((config) => {
  const token = getXsrfToken();
  if (token) config.headers["X-XSRF-TOKEN"] = token;
  return config;
});

export default apiClient;