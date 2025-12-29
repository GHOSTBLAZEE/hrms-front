// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: "http://hrms.test/api/v1",
//   withCredentials: true,
//   headers: {
//     Accept: "application/json",
//   },

//   // 🔐 CRITICAL FOR 419
//   xsrfCookieName: "XSRF-TOKEN",
//   xsrfHeaderName: "X-XSRF-TOKEN",
// });

// export default apiClient;
import axios from "axios";

function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const apiClient = axios.create({
  baseURL: "http://hrms.test",
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

