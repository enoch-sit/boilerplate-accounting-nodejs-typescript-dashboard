import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Register from '../../../components/auth/Register';

// Mock the authService
vi.mock('../../../services/authService', () => ({
  register: vi.fn().mockImplementation((userData) => {
    if (userData.email === 'test@example.com') {
      return Promise.resolve({ user: { email: 'test@example.com', username: 'testuser' } });
    } else {
      return Promise.reject(new Error('Registration failed'));
    }
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

describe('Register Component', () => {
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

  it('renders registration form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /I agree to the Terms and Conditions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\? Sign In/i)).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Click submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Fill in a weak password
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'weak' }
    });
    
    // Move focus to trigger validation
    fireEvent.blur(screen.getByLabelText(/Password/i));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password match', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password456!' }
    });
    
    // Move focus to trigger validation
    fireEvent.blur(screen.getByLabelText(/Confirm Password/i));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Fill in valid registration data
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' }
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree to the Terms and Conditions/i }));

    // Click register button
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Assert registration function was called with correct data
    await waitFor(() => {
      const authService = require('../../../services/authService');
      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      });
    });
  });

  it('handles failed registration', async () => {
    // Override the mock to simulate a failed registration
    const authService = require('../../../services/authService');
    authService.register.mockRejectedValueOnce(new Error('Registration failed'));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Fill in registration data
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'baduser' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'bad@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' }
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree to the Terms and Conditions/i }));

    // Click register button
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Assert error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});