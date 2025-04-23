import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthResponse, User } from '../../types/auth';
import authService from '../../services/authService';

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(null); // Silently fail, user is not logged in
    }
  }
);

// Initial state
const initialState: AuthState & { accessToken: string | null } = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    // Set auth error manually
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // Handle token refresh
    refreshToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register cases
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Don't set isAuthenticated here as we usually require email verification
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout cases
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Even if API logout fails, we clear the state
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });

    // Get current user cases
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

// Export actions and reducer
export const { clearError, setAuthError, refreshToken } = authSlice.actions;
export default authSlice.reducer;