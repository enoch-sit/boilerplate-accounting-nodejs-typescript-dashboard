import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Dashboard from '../../../components/dashboard/Dashboard';

// Mock any dependencies
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

jest.mock('../../../services/authService', () => ({
  getAuthToken: jest.fn()
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: {
    headers: {
      common: {}
    }
  }
}));

describe('Dashboard Component', () => {
  const mockStore = configureStore([]);
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup store with different user roles for testing
    store = mockStore({
      auth: {
        user: { id: '1', username: 'testuser', role: 'enduser' },
        isAuthenticated: true,
        loading: false,
        error: null
      }
    });
    
    // Mock useAuth hook
    const useAuth = require('../../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'testuser', role: 'enduser' }
    });
  });

  it('renders user dashboard for enduser role', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    // Assert user dashboard components are present
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
    
    // Check for user-specific widgets
    expect(screen.getByText(/Account Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    
    // User dashboard should NOT have admin features
    expect(screen.queryByText(/User Management/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/System Health/i)).not.toBeInTheDocument();
  });

  it('renders admin dashboard for admin role', async () => {
    // Override store for admin user
    store = mockStore({
      auth: {
        user: { id: '1', username: 'adminuser', role: 'admin' },
        isAuthenticated: true,
        loading: false,
        error: null
      }
    });
    
    // Mock useAuth for admin
    const useAuth = require('../../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'adminuser', role: 'admin' }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    // Assert admin dashboard components are present
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome, adminuser/i)).toBeInTheDocument();
    
    // Check for admin-specific widgets
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
    expect(screen.getByText(/System Health/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
  });

  it('renders supervisor dashboard for supervisor role', async () => {
    // Override store for supervisor user
    store = mockStore({
      auth: {
        user: { id: '1', username: 'supervisor', role: 'supervisor' },
        isAuthenticated: true,
        loading: false,
        error: null
      }
    });
    
    // Mock useAuth for supervisor
    const useAuth = require('../../../hooks/useAuth').useAuth;
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'supervisor', role: 'supervisor' }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    // Assert supervisor dashboard components are present
    expect(screen.getByText(/Supervisor Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome, supervisor/i)).toBeInTheDocument();
    
    // Check for supervisor-specific widgets
    expect(screen.getByText(/Team Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Reports Access/i)).toBeInTheDocument();
    
    // Supervisor should have some management features but not all admin features
    expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    expect(screen.queryByText(/System Configuration/i)).not.toBeInTheDocument();
  });

  it('fetches dashboard data on mount', async () => {
    const axios = require('axios');
    
    // Mock axios.get to return dashboard data
    axios.get.mockResolvedValueOnce({
      data: {
        recentActivity: [
          { id: 1, activity: 'Login', timestamp: new Date().toISOString() },
          { id: 2, activity: 'Profile update', timestamp: new Date().toISOString() }
        ],
        accountSummary: {
          lastLogin: new Date().toISOString(),
          accountStatus: 'active'
        }
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert the API was called with the correct endpoint
    expect(axios.get).toHaveBeenCalledWith('/api/dashboard');
    
    // Wait for data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
      expect(screen.getByText(/Profile update/i)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching dashboard data', () => {
    const axios = require('axios');
    
    // Mock axios.get but don't resolve the promise yet
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert loading state is shown
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
  });

  it('handles error state when API request fails', async () => {
    const axios = require('axios');
    
    // Mock axios.get to reject with an error
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch dashboard data'));
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch dashboard data/i)).toBeInTheDocument();
    });
  });
});