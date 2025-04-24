import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for the custom matchers
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserManagement from '../../../components/admin/UserManagement';

// Create a helper function to avoid the TS errors with toBeInTheDocument
const expectInDocument = (element: HTMLElement) => {
  // @ts-expect-error - jest-dom adds toBeInTheDocument but TypeScript doesn't know about it
  return expect(element).toBeInTheDocument();
};

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
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

// Mock useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    isAuthenticated: true,
    loading: false,
    user: { id: '1', username: 'adminuser', role: 'admin' }
  })
}));

describe('UserManagement Component', () => {
  const mockStore = configureStore([]);
  let store:any;
  
  // Mock user data
  const mockUsers = [
    { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2023-01-01' },
    { id: '2', username: 'supervisor', email: 'supervisor@example.com', role: 'supervisor', status: 'active', createdAt: '2023-01-02' },
    { id: '3', username: 'user1', email: 'user1@example.com', role: 'enduser', status: 'active', createdAt: '2023-01-03' },
    { id: '4', username: 'user2', email: 'user2@example.com', role: 'enduser', status: 'inactive', createdAt: '2023-01-04' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock store
    store = mockStore({
      auth: {
        user: { id: '1', username: 'adminuser', role: 'admin' },
        isAuthenticated: true,
        loading: false,
        error: null
      }
    });
    
    // Mock axios.get to return user data
    const axios = require('axios');
    axios.get.mockResolvedValue({
      data: {
        users: mockUsers,
        totalCount: mockUsers.length,
        totalPages: 1
      }
    });
  });

  it('renders user management interface', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert component renders correctly
    expectInDocument(screen.getByText(/User Management/i));
    
    // Wait for user data to load
    await waitFor(() => {
      expectInDocument(screen.getByText('admin@example.com'));
      expectInDocument(screen.getByText('supervisor@example.com'));
      expectInDocument(screen.getByText('user1@example.com'));
      expectInDocument(screen.getByText('user2@example.com'));
    });
    
    // Assert table headers are present
    expectInDocument(screen.getByText(/Username/i));
    expectInDocument(screen.getByText(/Email/i));
    expectInDocument(screen.getByText(/Role/i));
    expectInDocument(screen.getByText(/Status/i));
    expectInDocument(screen.getByText(/Created/i));
    expectInDocument(screen.getByText(/Actions/i));
  });

  it('fetches users from API on mount', async () => {
    const axios = require('axios');
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert API was called with correct endpoint
    expect(axios.get).toHaveBeenCalledWith('/api/admin/users', expect.any(Object));
    
    // Wait for data to be shown
    await waitFor(() => {
      mockUsers.forEach(user => {
        expectInDocument(screen.getByText(user.email));
      });
    });
  });

  it('allows searching for users', async () => {
    const axios = require('axios');
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText(/Search users/i);
    fireEvent.change(searchInput, { target: { value: 'supervisor' } });
    
    // Submit search
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Assert API was called with search parameter
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        '/api/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({ 
            search: 'supervisor'
          })
        })
      );
    });
  });

  it('allows filtering users by role', async () => {
    const axios = require('axios');
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Select role filter
    const roleFilter = screen.getByLabelText(/Filter by role/i);
    fireEvent.change(roleFilter, { target: { value: 'enduser' } });
    
    // Assert API was called with role filter
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        '/api/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({ 
            role: 'enduser'
          })
        })
      );
    });
  });

  it('allows changing user roles', async () => {
    const axios = require('axios');
    axios.put.mockResolvedValueOnce({
      data: { 
        ...mockUsers[2],
        role: 'supervisor'
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Wait for users to load
    await waitFor(() => {
      expectInDocument(screen.getByText('user1@example.com'));
    });
    
    // Find and click role change for user1
    const roleSelect = screen.getAllByLabelText(/Change role/i)[2]; // Third user
    fireEvent.change(roleSelect, { target: { value: 'supervisor' } });
    
    // Confirm the change in dialog
    fireEvent.click(screen.getByText(/Confirm/i));
    
    // Assert API was called to update role
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/admin/users/3/role',
        { role: 'supervisor' }
      );
    });
    
    // API call should refresh user list
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('allows activating/deactivating users', async () => {
    const axios = require('axios');
    axios.put.mockResolvedValueOnce({
      data: { 
        ...mockUsers[3],
        status: 'active'
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Wait for users to load
    await waitFor(() => {
      expectInDocument(screen.getByText('user2@example.com'));
    });
    
    // Find and click status toggle for user2 (currently inactive)
    const statusToggle = screen.getAllByLabelText(/Toggle status/i)[3]; // Fourth user
    fireEvent.click(statusToggle);
    
    // Assert API was called to update status
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/admin/users/4/status',
        { status: 'active' }
      );
    });
  });

  it('allows deleting a user', async () => {
    const axios = require('axios');
    axios.delete.mockResolvedValueOnce({
      data: { message: 'User deleted successfully' }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Wait for users to load
    await waitFor(() => {
      expectInDocument(screen.getByText('user1@example.com'));
    });
    
    // Find and click delete button for user1
    const deleteButtons = screen.getAllByLabelText(/Delete user/i);
    fireEvent.click(deleteButtons[2]); // Third user
    
    // Confirm deletion in dialog
    fireEvent.click(screen.getByText(/Confirm Delete/i));
    
    // Assert API was called to delete user
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/admin/users/3');
    });
    
    // API call should refresh user list
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('handles pagination', async () => {
    const axios = require('axios');
    // Mock response with pagination
    axios.get.mockResolvedValueOnce({
      data: {
        users: mockUsers.slice(0, 2),
        totalCount: mockUsers.length,
        totalPages: 2
      }
    }).mockResolvedValueOnce({
      data: {
        users: mockUsers.slice(2, 4),
        totalCount: mockUsers.length,
        totalPages: 2
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Wait for first page to load
    await waitFor(() => {
      expectInDocument(screen.getByText('admin@example.com'));
      expectInDocument(screen.getByText('supervisor@example.com'));
    });
    
    // Click next page button
    const nextPageButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextPageButton);
    
    // Assert API was called with page parameter
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        '/api/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({ 
            page: 2
          })
        })
      );
    });
    
    // Check second page content
    await waitFor(() => {
      expectInDocument(screen.getByText('user1@example.com'));
      expectInDocument(screen.getByText('user2@example.com'));
    });
  });

  it('shows loading state while fetching data', () => {
    const axios = require('axios');
    // Mock axios.get but don't resolve the promise
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert loading state is shown
    expectInDocument(screen.getByTestId('user-management-loading'));
  });

  it('shows error message when API request fails', async () => {
    const axios = require('axios');
    const errorMessage = 'Failed to fetch users';
    
    // Mock axios.get to reject with error
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserManagement />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert error message is shown
    await waitFor(() => {
      expectInDocument(screen.getByText(new RegExp(errorMessage, 'i')));
    });
  });
});