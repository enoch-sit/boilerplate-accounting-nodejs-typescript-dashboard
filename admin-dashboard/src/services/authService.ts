/**
 * Auth Service
 * 
 * This file contains methods to interact with authentication-related API endpoints.
 */

import ApiService from './apiService';
import { AuthAPIEndpoint } from './apiEndpoints';

// Types for authentication requests and responses
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
    role: string;
  };
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Auth service methods
const AuthService = {
  /**
   * Register a new user
   */
  signup: (data: SignupRequest) => {
    return ApiService.post<SignupResponse>(AuthAPIEndpoint.SIGNUP, data);
  },

  /**
   * Verify user email with token
   */
  verifyEmail: (data: VerifyEmailRequest) => {
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.VERIFY_EMAIL, data);
  },

  /**
   * Resend verification email
   */
  resendVerification: (email: string) => {
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.RESEND_VERIFICATION, { email });
  },

  /**
   * Authenticate user and get tokens
   */
  login: (data: LoginRequest) => {
    return ApiService.post<LoginResponse>(AuthAPIEndpoint.LOGIN, data)
      .then((response) => {
        // Store tokens in localStorage
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return response;
      });
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: (refreshToken: string) => {
    return ApiService.post<{ message: string; accessToken: string }>(
      AuthAPIEndpoint.REFRESH_TOKEN, 
      { refreshToken }
    );
  },

  /**
   * Logout user (invalidate current refresh token)
   */
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.LOGOUT, { refreshToken });
  },

  /**
   * Logout from all devices (invalidate all refresh tokens)
   */
  logoutAll: () => {
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.LOGOUT_ALL)
      .then((response) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      });
  },

  /**
   * Request password reset email
   */
  forgotPassword: (email: string) => {
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: (data: ResetPasswordRequest) => {
    return ApiService.post<{ message: string }>(AuthAPIEndpoint.RESET_PASSWORD, data);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};

export default AuthService;