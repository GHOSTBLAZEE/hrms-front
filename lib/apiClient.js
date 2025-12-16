// frontend/lib/apiClient.js

const API_BASE = "http://localhost/api/v1";

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include", // Sanctum session auth
    headers: {
      "Content-Type": "application/json",
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
