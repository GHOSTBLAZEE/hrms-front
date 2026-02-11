import apiClient from "./apiClient";

/**
 * ✅ FIXED: Login flow - let interceptor handle CSRF
 */
export async function loginApi({ email, password, remember = true }) {
  try {
    // ✅ REMOVED: Don't call /sanctum/csrf-cookie here
    // The interceptor will handle it automatically
    
    const response = await apiClient.post("/login", {
      email,
      password,
      remember,
    });
    
    return response.data;
  } catch (error) {
    // Better error handling
    const message = error.response?.data?.message || "Login failed";
    const status = error.response?.status;
    
    console.error("Login error:", { message, status, error });
    
    throw {
      message,
      data: error.response?.data,
      status,
    };
  }
}

export async function logoutApi() {
  try {
    const response = await apiClient.post("/logout");
    return response.data;
  } catch (error) {
    console.error("Logout API error:", error);
    throw {
      message: error.response?.data?.message || "Logout failed",
      data: error.response?.data,
      status: error.response?.status,
    };
  }
}

export async function getMeApi() {
  try {
    const response = await apiClient.get("/api/v1/me");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to fetch user data",
      data: error.response?.data,
      status: error.response?.status,
    };
  }
}

export async function refreshCsrfToken() {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    return true;
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
    return false;
  }
}