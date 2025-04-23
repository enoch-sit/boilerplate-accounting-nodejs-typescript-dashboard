import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../../../components/auth/Login';

// Mock the useAuth hook
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockImplementation((credentials) => {
      if (credentials.username === 'testuser' && credentials.password === 'Password123!') {
        return Promise.resolve({ username: 'testuser' });
      } else {
        return Promise.reject(new Error('Invalid credentials'));
      }
    }),
    error: null,
    clearError: vi.fn(),
    isAuthenticated: false
  })
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
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
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText(/Username or Email/i), {
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
    vi.mock('../../../hooks/useAuth', () => ({
      useAuth: () => ({
        login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
        error: null,
        clearError: vi.fn(),
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
    fireEvent.change(screen.getByLabelText(/Username or Email/i), {
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