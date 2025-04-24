import axios from 'axios';
import { store } from '../store';
import authService from '../services/authService';
import { logout, setAuthError } from '../features/auth/authSlice';

// Helper function to safely get environment variables in both Vite and Jest environments
const getEnvVar = (key: string, defaultValue: string): string => {
  // Check if we're in a test environment
  if (process.env.NODE_ENV === 'test') {
    return defaultValue;
  }
  // Otherwise use Vite's import.meta.env
  return (import.meta.env as any)[key] || defaultValue;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // To allow cookies for refresh tokens
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await authService.refreshToken();
        const { accessToken } = refreshResponse;
        
        // Update the token in the store
        store.dispatch({ type: 'auth/refreshToken', payload: accessToken });
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        store.dispatch(logout());
        store.dispatch(setAuthError('Your session has expired. Please log in again.'));
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject the promise
    // Convert error messages to a more user-friendly format
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    return Promise.reject(error);
  }
);

export default api;