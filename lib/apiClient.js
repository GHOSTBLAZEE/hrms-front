// frontend/lib/apiClient.js

const API_BASE = "http://localhost/api/v1";

// Helper to read cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

async function request(url, options = {}) {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include", // REQUIRED
    headers: {
      "Content-Type": "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    const err = new Error(data?.message || "Something went wrong");
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return data;
}

const apiClient = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};

export default apiClient;
