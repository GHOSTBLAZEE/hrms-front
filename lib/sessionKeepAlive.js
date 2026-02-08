import apiClient from './apiClient';

let activityTimer;
let isActive = true;
let keepAliveInterval = null;

const resetActivityTimer = () => {
  clearTimeout(activityTimer);
  
  activityTimer = setTimeout(() => {
    isActive = false;
  }, 5 * 60 * 1000); // 5 minutes of inactivity
};

// Ping the server to keep session alive
const keepSessionAlive = async () => {
  if (isActive) {
    try {
      await apiClient.get('/api/ping'); // Create this endpoint in Laravel
      console.log('✅ Session refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh session:', error);
    }
  }
};

// Initialize session keep-alive
export const initializeSessionKeepAlive = () => {
  // Prevent multiple initializations
  if (keepAliveInterval) {
    console.log('Session keep-alive already initialized');
    return;
  }

  console.log('🔄 Initializing session keep-alive...');

  // Track user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
      isActive = true;
      resetActivityTimer();
    }, true);
  });

  // Start the activity timer
  resetActivityTimer();

  // Ping every 10 minutes
  keepAliveInterval = setInterval(keepSessionAlive, 10 * 60 * 1000);
  
  // Initial ping
  keepSessionAlive();
};

// Cleanup function (optional - for unmounting)
export const cleanupSessionKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
  if (activityTimer) {
    clearTimeout(activityTimer);
  }
};