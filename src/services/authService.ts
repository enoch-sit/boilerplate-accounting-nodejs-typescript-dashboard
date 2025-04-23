import api from '../lib/axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User, RefreshTokenResponse } from '../types/auth';

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterCredentials) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/protected/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Request password reset
  async forgotPassword(email: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.post('/protected/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();