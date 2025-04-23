import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  login,
  logout,
  register,
  setLoading,
  clearError
} from '../../../features/auth/authSlice';

describe('Auth Slice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle login.pending', () => {
    const action = { type: login.pending.type };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle login.fulfilled', () => {
    const user = { id: '1', username: 'testuser', email: 'test@example.com', role: 'enduser' };
    const token = 'fake-jwt-token';
    const action = { type: login.fulfilled.type, payload: { user, token } };
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle login.rejected', () => {
    const errorMessage = 'Invalid credentials';
    const action = { 
      type: login.rejected.type,
      error: { message: errorMessage }
    };
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle register.pending', () => {
    const action = { type: register.pending.type };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle register.fulfilled', () => {
    const user = { id: '1', username: 'newuser', email: 'new@example.com', role: 'enduser' };
    const token = 'fake-jwt-token';
    const action = { type: register.fulfilled.type, payload: { user, token } };
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle register.rejected', () => {
    const errorMessage = 'Email already in use';
    const action = { 
      type: register.rejected.type,
      error: { message: errorMessage }
    };
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: '1', username: 'testuser', role: 'enduser' },
      token: 'fake-jwt-token',
      isAuthenticated: true,
      loading: false,
      error: null
    };
    
    const action = { type: logout.type };
    const state = authReducer(loggedInState, action);
    
    expect(state).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const action = { type: setLoading.type, payload: true };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error message'
    };
    
    const action = { type: clearError.type };
    const state = authReducer(stateWithError, action);
    expect(state.error).toBe(null);
  });
});