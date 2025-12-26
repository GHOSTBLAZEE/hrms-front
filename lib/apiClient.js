import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://hrms.test/api/v1",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },

  // 🔐 CRITICAL FOR 419
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export default apiClient;
