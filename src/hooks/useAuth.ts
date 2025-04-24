import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './useRedux';
import { login, logout, register, clearError } from '../features/auth/authSlice';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  
  const { user, isAuthenticated, loading, error } = auth;
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Check if user is supervisor
  const isSupervisor = user?.role === 'supervisor';
  
  // Check if user is enduser
  const isEndUser = user?.role === 'enduser';
  
  // Login function
  const loginUser = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const resultAction = await dispatch(login(credentials));
        if (login.fulfilled.match(resultAction)) {
          return { success: true, user: resultAction.payload.user };
        } else {
          return { success: false, error: resultAction.error.message || 'Login failed' };
        }
      } catch (error) {
        return { success: false, error: 'Login failed' };
      }
    },
    [dispatch]
  );
  
  // Register function
  const registerUser = useCallback(
    async (userData: RegisterCredentials) => {
      try {
        const resultAction = await dispatch(register(userData));
        if (register.fulfilled.match(resultAction)) {
          return { success: true };
        } else {
          return { success: false, error: resultAction.payload as string };
        }
      } catch (error) {
        return { success: false, error: 'Registration failed' };
      }
    },
    [dispatch]
  );
  
  // Logout function
  const logoutUser = useCallback(
    async () => {
      try {
        await dispatch(logout());
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Logout failed' };
      }
    },
    [dispatch]
  );
  
  // Clear error function
  const clearAuthError = useCallback(
    () => {
      dispatch(clearError());
    },
    [dispatch]
  );
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    isSupervisor,
    isEndUser,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    clearError: clearAuthError
  };
};