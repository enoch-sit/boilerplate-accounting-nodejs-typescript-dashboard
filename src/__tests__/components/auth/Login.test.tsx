import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../../../components/auth/Login';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn().mockImplementation((credentials) => {
      if (credentials.username === 'testuser' && credentials.password === 'Password123!') {
        return Promise.resolve({ username: 'testuser' });
      } else {
        return Promise.reject(new Error('Invalid credentials'));
      }
    }),
    error: null,
    clearError: jest.fn(),
    isAuthenticated: false
  })
}));

// Mock useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn()
  };
});

describe('Login Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Use getAllByText for "Sign In" since it appears multiple times
    expect(screen.getAllByText(/Sign In/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Sign Up/i)).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Click submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Fill in valid credentials
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' }
    });

    // Click login button
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Assert login function was called with correct credentials
    await waitFor(() => {
      const auth = require('../../../hooks/useAuth');
      expect(auth.useAuth().login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'Password123!',
        rememberMe: false
      });
    });
  });

  it('handles failed login', async () => {
    // Override the mock to simulate a failed login
    jest.mock('../../../hooks/useAuth', () => ({
      useAuth: () => ({
        login: jest.fn().mockRejectedValue(new Error('Invalid credentials')),
        error: null,
        clearError: jest.fn(),
        isAuthenticated: false
      })
    }));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Fill in invalid credentials
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });

    // Click login button
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Assert error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});