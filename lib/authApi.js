import axios from "axios";

// global config
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const loginApi = async (credentials) => {
  // 1️⃣ Get CSRF cookie
  await axios.get("http://hrms.test/sanctum/csrf-cookie");

  // 2️⃣ Read + decode token
  const token = getXsrfToken();

  // 3️⃣ Send login with explicit header
  return axios.post(
    "http://hrms.test/login",
    credentials,
    {
      headers: {
        "X-XSRF-TOKEN": token,
      },
    }
  );
};
