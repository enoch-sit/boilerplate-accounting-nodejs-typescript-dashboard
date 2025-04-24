import authService from '../../services/authService';
import api from '../../lib/axios';
import { RegisterCredentials } from '../../types/auth';

// Mock axios module
jest.mock('../../lib/axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn()
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should make POST request to /auth/login endpoint', async () => {
      const credentials = { username: 'testuser', password: 'Password123!', rememberMe: false };
      const mockResponse = { 
        data: { 
          accessToken: 'fake-jwt-token', 
          refreshToken: 'fake-refresh-token',
          user: { _id: '1', username: 'testuser', role: 'enduser', email: 'test@example.com', isVerified: true, status: 'active', createdAt: '', updatedAt: '' } 
        } 
      };
      
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await authService.login(credentials);
      
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle login errors', async () => {
      const credentials = { username: 'testuser', password: 'WrongPassword' };
      const errorMessage = 'Invalid credentials';
      
      (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });
  
  describe('register', () => {
    it('should make POST request to /auth/signup endpoint', async () => {
      const userData: RegisterCredentials = { 
        username: 'newuser', 
        email: 'new@example.com', 
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      const mockResponse = { 
        data: { 
          accessToken: 'fake-jwt-token',
          refreshToken: 'fake-refresh-token',
          user: { _id: '2', username: 'newuser', email: 'new@example.com', role: 'enduser', isVerified: false, status: 'active', createdAt: '', updatedAt: '' } 
        } 
      };
      
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await authService.register(userData);
      
      expect(api.post).toHaveBeenCalledWith('/auth/signup', userData);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle registration errors', async () => {
      const userData: RegisterCredentials = { 
        username: 'existinguser', 
        email: 'existing@example.com', 
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      const errorMessage = 'User already exists';
      
      (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(authService.register(userData)).rejects.toThrow();
    });
  });
  
  describe('logout', () => {
    it('should make POST request to /auth/logout endpoint', async () => {
      const mockResponse = { data: { message: 'Logged out successfully' } };
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      await authService.logout();
      
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });
  
  describe('forgotPassword', () => {
    it('should make POST request to /auth/forgot-password endpoint', async () => {
      const email = 'user@example.com';
      const mockResponse = { 
        data: { message: 'Password reset email sent' } 
      };
      
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await authService.forgotPassword(email);
      
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('resetPassword', () => {
    it('should make POST request to /auth/reset-password endpoint', async () => {
      const token = 'reset-token-123';
      const newPassword = 'NewPassword123!';
      const mockResponse = { 
        data: { message: 'Password reset successful' } 
      };
      
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await authService.resetPassword(token, newPassword);
      
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', { token, newPassword });
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('refreshToken', () => {
    it('should make POST request to /auth/refresh endpoint', async () => {
      const mockResponse = { 
        data: { accessToken: 'new-jwt-token' } 
      };
      
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await authService.refreshToken();
      
      expect(api.post).toHaveBeenCalledWith('/auth/refresh');
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle refresh token errors', async () => {
      const errorMessage = 'Refresh token expired';
      
      (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(authService.refreshToken()).rejects.toThrow();
    });
  });
});