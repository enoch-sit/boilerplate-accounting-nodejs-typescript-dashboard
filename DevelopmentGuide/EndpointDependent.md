# API Endpoints Dependency Documentation

This document lists all the API endpoints that the Simple Accounting Dashboard application connects to, organized by feature and with references to the relevant files where they are used.

## Authentication Endpoints

### Login & Session Management

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/auth/login` | POST | User login with credentials | `src/services/authService.ts`, `src/components/auth/Login.tsx`, `src/features/auth/authSlice.ts` |
| `/api/auth/logout` | POST | User logout, invalidate session | `src/services/authService.ts`, `src/features/auth/authSlice.ts`, `src/layouts/DashboardLayout.tsx` |
| `/api/auth/logout-all` | POST | Logout from all active devices | `src/services/authService.ts`, `src/features/auth/authSlice.ts`, `src/components/profile/Profile.tsx` |
| `/api/auth/refresh` | POST | Refresh access token | `src/services/authService.ts`, `src/lib/axios.ts` |
| `/api/profile` | GET | Get current user profile data | `src/services/authService.ts`, `src/components/profile/Profile.tsx` |

### Registration & Account Verification

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/auth/signup` | POST | New user registration | `src/services/authService.ts`, `src/components/auth/Register.tsx`, `src/features/auth/authSlice.ts` |
| `/api/auth/verify-email` | POST | Verify user email after registration | `src/services/authService.ts`, `src/features/auth/authSlice.ts`, `src/components/auth/EmailVerification.tsx` |
| `/api/auth/resend-verification` | POST | Resend verification email | `src/services/authService.ts`, `src/features/auth/authSlice.ts` |

### Password Management

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/auth/forgot-password` | POST | Request password reset link | `src/services/authService.ts`, `src/components/auth/recovery/ForgotPassword.tsx`, `src/components/settings/Settings.tsx` |
| `/api/auth/reset-password` | POST | Reset password with token | `src/services/authService.ts`, `src/components/auth/recovery/ResetPassword.tsx` |
| `/api/change-password` | POST | Change password while authenticated | `src/services/authService.ts`, `src/components/settings/Settings.tsx` |

## Admin Endpoints

### User Management

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/admin/users` | GET | List all users with pagination | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users` | POST | Create new user | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/batch` | POST | Bulk create users | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/:userId` | GET | Get details for specific user | `src/services/adminService.ts` |
| `/api/admin/users/:userId` | PUT | Update user details | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/:userId` | DELETE | Delete specific user | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/:userId/status` | PATCH | Update user status | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/:userId/role` | PUT | Update user role | Used in tests, not explicitly seen in implementation |
| `/api/admin/users/:userId/reset-password` | POST | Send password reset email | `src/services/adminService.ts`, `src/components/admin/UserManagement.tsx` |
| `/api/admin/users/:userId/logs` | GET | Get user activity logs | `src/services/adminService.ts` |

### Admin Dashboard and Reports

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/admin/dashboard` | GET | Admin-specific dashboard data | Referenced in documentation, no explicit implementation |
| `/api/admin/reports/users` | GET | Generate user activity report | `src/services/adminService.ts` |

## Protected Endpoints

### User Dashboard and Profile

| Endpoint | HTTP Method | Purpose | Used in Files |
|----------|-------------|---------|--------------|
| `/api/dashboard` | GET | User dashboard data | Referenced in documentation, no explicit implementation |
| `/api/profile` | GET | Get user profile | `src/services/authService.ts` |
| `/api/profile` | PUT | Update user profile | `src/services/authService.ts`, `src/components/profile/Profile.tsx` |

## Implementation Details

The application uses Axios as the HTTP client, configured in `src/lib/axios.ts`. Key implementation notes:

1. All API requests use a base URL configured via environment variable: `VITE_API_URL` or fallback to `http://localhost:3000/api`
2. Authentication tokens are automatically included in request headers
3. Token refresh is handled automatically for 401 responses
4. API endpoints are primarily accessed through service modules (`authService.ts` and `adminService.ts`)

## Authentication Flow

1. The application authenticates via JWT tokens
2. Access tokens are stored in memory (Redux store)
3. Refresh tokens may be stored in HTTP-only cookies or localStorage based on "Remember Me" setting
4. Auth state is maintained in Redux and accessible via the `useAuth` hook
5. Token refresh happens automatically when receiving 401 unauthorized responses

## Common API Response Patterns

All API responses follow these general patterns:

1. Success responses include relevant data and often a success message
2. Error responses include appropriate HTTP status codes and error messages
3. Authentication endpoints return tokens and user information
4. List endpoints support pagination, filtering, and sorting

This document should be updated when new endpoints are added to the application or existing endpoints are modified.