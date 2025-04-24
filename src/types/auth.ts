export type UserRole = 'admin' | 'supervisor' | 'enduser';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profilePicture?: string;
  status: UserStatus;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface UserFormData {
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface BatchUserData {
  username: string;
  email: string;
  role?: UserRole;
}