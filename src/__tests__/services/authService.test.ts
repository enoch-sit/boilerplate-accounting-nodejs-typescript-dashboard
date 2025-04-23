import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authService from '../../../services/authService';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup local storage mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should make POST request to /api/auth/login endpoint', async () => {
      const credentials = { username: 'testuser', password: 'Password123!', rememberMe: false };
      const mockResponse = { 
        data: { 
          token: 'fake-jwt-token', 
          user: { id: '1', username: 'testuser', role: 'enduser' } 
        } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await authService.login(credentials);
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    });
    
    it('should set remember me token if rememberMe is true', async () => {
      const credentials = { username: 'testuser', password: 'Password123!', rememberMe: true };
      const mockResponse = { 
        data: { 
          token: 'fake-jwt-token',
          refreshToken: 'fake-refresh-token',
          user: { id: '1', username: 'testuser', role: 'enduser' } 
        } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      await authService.login(credentials);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token');
    });
    
    it('should handle login errors', async () => {
      const credentials = { username: 'testuser', password: 'WrongPassword' };
      const errorMessage = 'Invalid credentials';
      
      axios.post.mockRejectedValueOnce({ 
        response: { data: { message: errorMessage } } 
      });
      
      await expect(authService.login(credentials)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('register', () => {
    it('should make POST request to /api/auth/signup endpoint', async () => {
      const userData = { 
        username: 'newuser', 
        email: 'new@example.com', 
        password: 'Password123!' 
      };
      const mockResponse = { 
        data: { 
          token: 'fake-jwt-token', 
          user: { id: '2', username: 'newuser', email: 'new@example.com', role: 'enduser' } 
        } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await authService.register(userData);
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/signup', userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    });
    
    it('should handle registration errors', async () => {
      const userData = { 
        username: 'existinguser', 
        email: 'existing@example.com', 
        password: 'Password123!' 
      };
      const errorMessage = 'User already exists';
      
      axios.post.mockRejectedValueOnce({ 
        response: { data: { message: errorMessage } } 
      });
      
      await expect(authService.register(userData)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('logout', () => {
    it('should remove token from localStorage', async () => {
      await authService.logout();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
    
    it('should make POST request to /api/auth/logout endpoint if token exists', async () => {
      localStorage.getItem.mockReturnValueOnce('fake-jwt-token');
      
      await authService.logout();
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/logout', {}, {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
    });
  });
  
  describe('forgotPassword', () => {
    it('should make POST request to /api/auth/forgot-password endpoint', async () => {
      const email = 'user@example.com';
      const mockResponse = { 
        data: { message: 'Password reset email sent' } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await authService.forgotPassword(email);
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/forgot-password', { email });
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('resetPassword', () => {
    it('should make POST request to /api/auth/reset-password endpoint', async () => {
      const resetData = { 
        token: 'reset-token-123', 
        newPassword: 'NewPassword123!' 
      };
      const mockResponse = { 
        data: { message: 'Password reset successful' } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await authService.resetPassword(resetData);
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/reset-password', resetData);
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('getAuthToken', () => {
    it('should return token from localStorage', () => {
      const token = 'fake-jwt-token';
      localStorage.getItem.mockReturnValueOnce(token);
      
      const result = authService.getAuthToken();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe(token);
    });
  });
  
  describe('refreshToken', () => {
    it('should make POST request to /api/auth/refresh endpoint', async () => {
      const refreshToken = 'fake-refresh-token';
      localStorage.getItem.mockReturnValueOnce(refreshToken);
      
      const mockResponse = { 
        data: { token: 'new-jwt-token' } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await authService.refreshToken();
      
      expect(axios.post).toHaveBeenCalledWith('/api/auth/refresh', { refreshToken });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-jwt-token');
    });
    
    it('should handle refresh token errors', async () => {
      localStorage.getItem.mockReturnValueOnce('expired-refresh-token');
      
      const errorMessage = 'Refresh token expired';
      
      axios.post.mockRejectedValueOnce({ 
        response: { data: { message: errorMessage } } 
      });
      
      await expect(authService.refreshToken()).rejects.toThrow(errorMessage);
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });
});