/**
 * API Endpoints
 * 
 * This file contains all the API endpoints for the application organized by category.
 * Base URL is configured for different environments.
 */

// Base URL configuration for Vite application
const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://your-production-api.com' // Replace with actual production URL
  : 'http://localhost:3000';

/**
 * Authentication API Endpoints
 */
export const AuthAPIEndpoint = {
  // Auth Routes
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  VERIFY_EMAIL: `${BASE_URL}/api/auth/verify-email`,
  RESEND_VERIFICATION: `${BASE_URL}/api/auth/resend-verification`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  LOGOUT_ALL: `${BASE_URL}/api/auth/logout-all`,
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
};

/**
 * Protected API Endpoints (require authentication)
 */
export const ProtectedAPIEndpoint = {
  // Profile Routes
  GET_PROFILE: `${BASE_URL}/api/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/api/change-password`,
  DASHBOARD: `${BASE_URL}/api/dashboard`,
};

/**
 * Admin API Endpoints (require admin privileges)
 */
export const AdminAPIEndpoint = {
  // User Management
  GET_ALL_USERS: `${BASE_URL}/api/admin/users`,
  CREATE_USER: `${BASE_URL}/api/admin/users`,
  CREATE_BATCH_USERS: `${BASE_URL}/api/admin/users/batch`,
  DELETE_ALL_USERS: `${BASE_URL}/api/admin/users`,
  DELETE_USER: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
  UPDATE_USER_ROLE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}/role`,
  
  // Admin Features
  REPORTS: `${BASE_URL}/api/admin/reports`,
  ADMIN_DASHBOARD: `${BASE_URL}/api/admin/dashboard`,
};

/**
 * Testing API Endpoints (development mode only)
 */
export const TestingAPIEndpoint = {
  GET_VERIFICATION_TOKEN: (userId: string, type?: string) => 
    `${BASE_URL}/api/testing/verification-token/${userId}${type ? `/${type}` : ''}`,
  VERIFY_USER_DIRECTLY: (userId: string) => 
    `${BASE_URL}/api/testing/verify-user/${userId}`,
};

/**
 * Miscellaneous API Endpoints
 */
export const MiscAPIEndpoint = {
  HEALTH_CHECK: `${BASE_URL}/health`,
};

/**
 * All API Endpoints combined
 */
export const APIEndpoints = {
  Auth: AuthAPIEndpoint,
  Protected: ProtectedAPIEndpoint,
  Admin: AdminAPIEndpoint,
  Testing: TestingAPIEndpoint,
  Misc: MiscAPIEndpoint,
};

export default APIEndpoints;