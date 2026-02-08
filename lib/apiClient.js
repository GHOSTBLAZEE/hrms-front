import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://hrms.test",
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

let csrfInitialized = false;
let sessionWarningShown = false; // ✅ Add this

const initializeCsrf = async () => {
  if (!csrfInitialized) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://hrms.test";
      await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      csrfInitialized = true;
      console.log("✅ CSRF cookie initialized");
    } catch (error) {
      console.error("❌ Failed to initialize CSRF cookie:", error);
      throw error;
    }
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    
    if (["post", "put", "patch", "delete"].includes(method)) {
      await initializeCsrf();
      
      const token = getCsrfToken();
      if (token) {
        config.headers["X-XSRF-TOKEN"] = token;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ UPDATED Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Reset warning flag on successful requests
    sessionWarningShown = false;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419 && !originalRequest._retry) {
      console.warn("⚠️ CSRF token mismatch, refreshing...");
      originalRequest._retry = true;
      
      csrfInitialized = false;
      await initializeCsrf();
      
      return apiClient(originalRequest);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const isAuthEndpoint = originalRequest.url?.includes('/login') || 
                            originalRequest.url?.includes('/register') ||
                            originalRequest.url?.includes('/ping');
      
      // Don't redirect if it's an auth endpoint or ping
      if (!isAuthEndpoint && !sessionWarningShown) {
        sessionWarningShown = true;
        
        console.error("❌ Session expired - redirecting to login in 3 seconds...");
        
        // Optional: Show toast notification
        // if (typeof window !== 'undefined' && window.toast) {
        //   window.toast.warning("Your session has expired. Please log in again.");
        // }
        
        // Clear auth state
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        csrfInitialized = false;
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    }
    
    return Promise.reject(error);
  }
);

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const ensureCsrfToken = async () => {
  await initializeCsrf();
};

export default apiClient;