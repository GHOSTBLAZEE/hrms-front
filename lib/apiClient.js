// frontend/lib/apiClient.js

// 🔥 CHANGE THIS ONLY IF YOUR PROJECT IS IN A SUBFOLDER
const API_BASE = "http://localhost/api/v1";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
}

// 🔐 Sanctum CSRF
export async function ensureCsrfCookie() {
  await fetch("http://localhost/sanctum/csrf-cookie", {
    credentials: "include",
  });
}

async function request(url, options = {}) {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE}${url}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      ...(options.headers || {}),
    },
    body: options.body,
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

  post: async (url, body) => {
    await ensureCsrfCookie();
    return request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async (url, body) => {
    await ensureCsrfCookie();
    return request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: async (url) => {
    await ensureCsrfCookie();
    return request(url, {
      method: "DELETE",
    });
  },
};

export default apiClient;
