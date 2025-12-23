import axios from "axios";
import Router from "next/router";

const apiClient = axios.create({
  baseURL: "/api/v1", // proxy → Laravel
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
