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
let sessionWarningShown = false;

// ✅ FIXED: Define getCsrfToken BEFORE it's used
function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const initializeCsrf = async () => {
  if (!csrfInitialized) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://hrms.test";
      console.log(baseURL);
      
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
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
      
      if (!isAuthEndpoint && !sessionWarningShown) {
        sessionWarningShown = true;
        
        console.error("❌ Session expired - redirecting to login...");
        
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        csrfInitialized = false;
        
        // ✅ FIXED: Only redirect if window is available
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const ensureCsrfToken = async () => {
  await initializeCsrf();
};

export default apiClient;