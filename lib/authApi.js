import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Accept"] = "application/json";

export const loginApi = async (credentials) => {
  // MUST go through proxy
  await axios.get("/sanctum/csrf-cookie");

  const res = await axios.post("/login", credentials);
  return res.data;
};

export const logoutApi = async () => {
  await axios.post("/logout");
};
