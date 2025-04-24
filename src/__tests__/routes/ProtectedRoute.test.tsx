import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../routes/ProtectedRoute';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('ProtectedRoute Component', () => {
  // Test case for unauthenticated user
  it('redirects to login page when user is not authenticated', () => {
    // Mock useAuth to return unauthenticated user
    const useAuth = require('../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null
    });
    
    render(
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  // Test case for authenticated user with correct role
  it('renders children when user is authenticated with proper role', () => {
    // Mock useAuth to return authenticated user with admin role
    const useAuth = require('../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'admin', role: 'admin' }
    });
    
    render(
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                <div>Admin Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
  
  // Test case for authenticated user with incorrect role
  it('redirects to unauthorized page when user has incorrect role', () => {
    // Mock useAuth to return authenticated user with end user role
    const useAuth = require('../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'enduser', role: 'enduser' }
    });
    
    render(
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                <div>Admin Content</div>
              </ProtectedRoute>
            } 
          />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
  
  // Test case for loading state
  it('shows loading indicator when authentication state is loading', () => {
    // Mock useAuth to return loading state
    const useAuth = require('../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null
    });
    
    render(
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});