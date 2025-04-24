import authReducer, {
  login,
  logout,
  register,
  clearError
} from '../../../features/auth/authSlice';
import { AuthState } from '../../../types/auth';

// Interface extending AuthState with the additional accessToken property
interface AuthStateWithToken extends AuthState {
  accessToken: string | null;
}

describe('Auth Slice', () => {
  let initialState: AuthStateWithToken;

  beforeEach(() => {
    initialState = {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'INIT' })).toEqual(
      expect.objectContaining({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      })
    );
  });

  it('should handle login.pending', () => {
    const action = { type: login.pending.type };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle login.fulfilled', () => {
    const user = {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'enduser', 
      isVerified: true,
      createdAt: '2025-04-20T00:00:00.000Z',
      updatedAt: '2025-04-20T00:00:00.000Z',
      status: 'active'
    };
    const accessToken = 'fake-jwt-token';
    const action = { type: login.fulfilled.type, payload: { user, accessToken } };
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe(accessToken);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle login.rejected', () => {
    const errorMessage = 'Invalid credentials';
    const action = { 
      type: login.rejected.type,
      payload: errorMessage
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
    const action = { type: register.fulfilled.type };
    const state = authReducer(initialState, action);
    
    expect(state.loading).toBe(false);
  });

  it('should handle register.rejected', () => {
    const errorMessage = 'Email already in use';
    const action = { 
      type: register.rejected.type,
      payload: errorMessage
    };
    const state = authReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle logout.fulfilled', () => {
    const loggedInState: AuthStateWithToken = {
      user: {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'enduser',
        isVerified: true,
        createdAt: '2025-04-20T00:00:00.000Z',
        updatedAt: '2025-04-20T00:00:00.000Z',
        status: 'active'
      },
      accessToken: 'fake-jwt-token',
      isAuthenticated: true,
      loading: false,
      error: null
    };
    
    const action = { type: logout.fulfilled.type };
    const state = authReducer(loggedInState, action);
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.accessToken).toBe(null);
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