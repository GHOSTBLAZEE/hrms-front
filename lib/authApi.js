import apiClient from "./apiClient";

/**
 * Authentication API for Laravel Sanctum SPA
 * 
 * Sanctum SPA uses session-based authentication with CSRF protection
 */

/**
 * Login user with email and password
 * 
 * Flow:
 * 1. Get CSRF cookie from Laravel
 * 2. Send login credentials
 * 3. Laravel creates session
 * 4. Return user data
 */
export async function loginApi({ email, password, remember = true }) {
  try {
    // Step 1: Get CSRF cookie (required for Sanctum SPA)
    await apiClient.get("/sanctum/csrf-cookie");
    
    // Step 2: Send login request
    const response = await apiClient.post("/login", {
      email,
      password,
      remember,
    });
    
    return response.data;
  } catch (error) {
    // Re-throw with better error message
    throw {
      message: error.response?.data?.message || "Login failed",
      data: error.response?.data,
      status: error.response?.status,
    };
  }
}

/**
 * Logout current user
 * 
 * Flow:
 * 1. Call logout endpoint (invalidates session on backend)
 * 2. Backend clears session and regenerates token
 * 3. Return success
 */
export async function logoutApi() {
  try {
    const response = await apiClient.post("/logout");
    return response.data;
  } catch (error) {
    // Even if logout fails, we should still clear frontend state
    console.error("Logout API error:", error);
    throw {
      message: error.response?.data?.message || "Logout failed",
      data: error.response?.data,
      status: error.response?.status,
    };
  }
}

/**
 * Get current user data
 */
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

/**
 * Refresh CSRF token (useful after idle period)
 */
export async function refreshCsrfToken() {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    return true;
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
    return false;
  }
}