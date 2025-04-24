# Debugging Guide for Simple Accounting Dashboard

This guide outlines the essential knowledge and techniques required to debug effectively in this TypeScript authentication application project.

## Table of Contents
1. [TypeScript Type Errors](#typescript-type-errors)
2. [Redux State Management Debugging](#redux-state-management-debugging)
3. [Authentication Flow Debugging](#authentication-flow-debugging)
4. [Testing Issues and Solutions](#testing-issues-and-solutions)
5. [Common Error Patterns](#common-error-patterns)
6. [Tools and Extensions](#tools-and-extensions)

## TypeScript Type Errors

### Understanding TypeScript Error Messages

TypeScript error messages follow a specific pattern:
```
Error Code (e.g., ts(2345)): Error message
```

Common error codes:
- **ts(2322)**: Type assignment error
- **ts(2345)**: Argument type error
- **ts(2559)**: Cannot use JSX on type with no common properties
- **ts(2614)**: Module has no exported member
- **ts(7034)**: Variable implicitly has 'any' type

### Fixing Interface Mismatches

Interface mismatches are common in TypeScript projects. To fix them:

1. **Identify the expected interface**: Look at error messages to determine what shape the object should have
2. **Compare with actual values**: Check what properties are missing or incorrect
3. **Update the implementation**: Add missing properties or type the variable correctly

Example:
```typescript
// Error: Type '{ id: string; }' is not assignable to type 'User'.
// Property '_id' is missing in type '{ id: string; }'

// Fix: Change property name or create a complete object
const user: User = {
  _id: '1',  // Changed from 'id' to '_id'
  username: 'test',
  email: 'test@example.com',
  // Add all required properties...
};
```

### Union Types and Null Handling

Be careful with union types (e.g., `User | null`). Always check for null before accessing properties:

```typescript
// Error-prone code
const username = user.username; // Error if user is null

// Safe code
const username = user ? user.username : '';
// or
const username = user?.username ?? '';
```

## Redux State Management Debugging

### Redux Flow and Debugging Points

The Redux flow in this application follows:
1. **Action dispatch**: UI component calls a function
2. **Thunk middleware**: Handles async operations
3. **Reducer**: Updates state based on action
4. **Selector**: Component gets updated state

Debugging points:
- Verify action payload before dispatch
- Check thunk error handling
- Inspect reducer state transitions
- Confirm selector returns expected data

### Common Redux Issues

1. **Action Type Errors**:
   - Solution: Ensure action types are strings, not undefined
   - Example fix:
     ```typescript
     // Error: Type 'undefined' is not assignable to type 'string'
     // Fix:
     const action = { type: 'INIT' }; // Use a string instead of undefined
     ```

2. **State Shape Inconsistencies**:
   - Problem: Reducer expects different state shape than provided
   - Solution: Ensure test state matches the actual state shape

3. **Async Action Handling**:
   - Problem: Not handling pending/fulfilled/rejected states properly
   - Solution: Implement proper error handling for all async states

## Authentication Flow Debugging

### Authentication State Issues

Common authentication debugging areas:

1. **Token Storage**:
   - Check token retrieval from local storage or state
   - Verify token format and expiration

2. **Route Protection**:
   - Debug ProtectedRoute component to ensure proper redirects
   - Check role-based authorization logic

3. **Login/Logout Cycle**:
   - Trace the complete auth cycle from login to logout
   - Ensure state is properly cleared on logout

Example debugging auth flow:
```typescript
// Check if user state is properly managed
console.log('Auth state:', store.getState().auth);

// Verify token is valid
console.log('Token:', localStorage.getItem('token'));

// Test protected route logic
console.log('User roles:', store.getState().auth.user?.role);
console.log('Required roles:', allowedRoles);
```

## Testing Issues and Solutions

### Test Environment Setup

1. **Testing Library Conflicts**:
   - Issue: Conflicts between Jest and Vitest
   - Solution: Configure proper test environment in vite.config.ts

2. **Mock Implementation Tips**:
   - Create type-safe mocks for auth state
   - Use vi.mock() to mock complex dependencies
   - Always restore mocks after test completion

### Common Test Errors

1. **Type Errors in Tests**:
   - Problem: Mock objects don't match required interfaces
   - Solution: Create mock factories that return properly typed objects

2. **Component Testing**:
   - Problem: Protected routes require auth context
   - Solution: Mock auth context provider for testing

Example test mocking:
```typescript
// Mock auth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    user: {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
      isVerified: true,
      createdAt: '2025-04-20T00:00:00.000Z',
      updatedAt: '2025-04-20T00:00:00.000Z',
      status: 'active'
    }
  })
}));
```

## Common Error Patterns

### Module Not Found Errors

When encountering "Cannot find module" errors:

1. Check if the module is installed:
   ```
   npm list <package-name>
   ```

2. Install missing dependencies:
   ```
   npm install <package-name>
   ```

3. Update import paths:
   ```typescript
   // Error: Cannot find module '../../../hooks/useAuth'
   // Fix: Check the actual path
   import { useAuth } from '../../hooks/useAuth';
   ```

### Type Definition Issues

For "has no exported member" errors:

1. Check the module's actual exports
2. Update import statements to match available exports
3. Consider using type assertions when necessary

```typescript
// Error: Module has no exported member 'setLoading'
// Fix: Remove non-existent import
import { login, logout, clearError } from '../features/auth/authSlice';
// NOT: import { login, logout, clearError, setLoading } from '...';
```

## Tools and Extensions

### VS Code Extensions for Debugging

1. **ESLint**: Identify code quality issues
2. **TypeScript Error Translator**: Get clearer error messages
3. **Redux DevTools**: Inspect Redux state and actions

### Browser Tools

1. **Redux DevTools Extension**: Monitor state changes
2. **React Developer Tools**: Inspect component props and state
3. **Network Tab**: Debug API requests and responses

### Terminal Debugging

Use these commands for troubleshooting:

```bash
# Type checking
npx tsc --noEmit

# Test specific files
npm run test:vitest -- src/__tests__/features/auth/authSlice.test.ts

# Lint specific files
npm run lint -- src/features/auth/authSlice.ts
```

## Conclusion

Effective debugging in this project requires understanding of:
- TypeScript's type system and error messages
- Redux state management patterns
- Authentication flow and security considerations
- Testing strategies for React components and Redux

By methodically approaching errors using the techniques in this guide, you can efficiently resolve issues and maintain a robust application.

Remember to always:
1. Read error messages carefully
2. Check type definitions against implementations
3. Use proper typing for all objects
4. Test both success and failure cases