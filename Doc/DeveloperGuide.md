# Simple Accounting Dashboard - Developer Guide

This comprehensive guide provides all the information a new developer needs to understand and work with this TypeScript-based React application.

## Table of Contents

- [Simple Accounting Dashboard - Developer Guide](#simple-accounting-dashboard---developer-guide)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Key Functionalities](#key-functionalities)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Key Features](#key-features)
    - [Authentication](#authentication)
    - [Dashboard](#dashboard)
    - [User Management](#user-management)
    - [Theme Support](#theme-support)
  - [Authentication Flow](#authentication-flow)
  - [State Management](#state-management)
    - [Redux Store Structure](#redux-store-structure)
  - [Routing](#routing)
  - [API Integration](#api-integration)
  - [Component Architecture](#component-architecture)
  - [Styling](#styling)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing Guidelines](#contributing-guidelines)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Authentication Server Configuration](#authentication-server-configuration)
    - [Setting the API URL](#setting-the-api-url)
      - [Configuration Options](#configuration-options)
    - [API Endpoints](#api-endpoints)
    - [Testing the API Connection](#testing-the-api-connection)

## Project Overview

This project is a simple accounting dashboard application with authentication features. It provides user management, authentication workflows, and a dashboard interface for accounting-related activities.

### Key Functionalities

- User authentication (login, register, password recovery)
- User profile management
- Role-based access control
- Theme switching (light/dark mode)
- Dashboard with accounting features
- Admin user management

## Tech Stack

The application is built with the following technologies:

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 6
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **UI Components**: Material UI 7
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **Testing**: Jest and React Testing Library
- **Containerization**: Docker
- **Styles**: CSS with Emotion
- **Linting**: ESLint

## Project Structure

The project follows a feature-based organization structure:

```
src/
├── assets/           # Static assets like images and icons
├── components/       # UI components organized by feature
│   ├── admin/        # Admin-specific components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard components
│   ├── profile/      # User profile components
│   └── settings/     # Settings components
├── features/         # Redux slices organized by feature
│   ├── auth/         # Authentication state management
│   └── theme/        # Theme state management
├── hooks/            # Custom React hooks
├── layouts/          # Layout components (e.g., DashboardLayout)
├── lib/              # Utility libraries (e.g., configured axios)
├── routes/           # Routing components and configuration
├── services/         # API service modules
├── store/            # Redux store configuration
├── types/            # TypeScript type definitions
└── __tests__/        # Test files mirroring the src structure
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd simple-accounting-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For Docker-based development:
   ```bash
   docker-compose up
   ```

## Key Features

### Authentication

The application includes a complete authentication system with:
- Login/logout functionality
- New user registration
- Password recovery flow
- Session management

### Dashboard

The main dashboard provides accounting-related features and visualizations.

### User Management

Admin users can manage other users' accounts, including:
- Creating new users
- Updating user information
- Disabling accounts
- Assigning roles

### Theme Support

The application supports both light and dark themes, with a toggle in the settings.

## Authentication Flow

1. **Login**: Users provide credentials, which are validated against the backend. Upon successful authentication, an access token is stored in memory, and a refresh token is stored in an HTTP-only cookie.

2. **Registration**: New users can sign up by providing their information. Email verification may be required.

3. **Session Management**: The application maintains the user's session using tokens. The auth service refreshes tokens automatically when needed.

4. **Password Recovery**: Users can request a password reset link via email and then set a new password.

## State Management

The application uses Redux Toolkit for state management:

- **Auth Slice**: Manages user authentication state
- **Theme Slice**: Manages UI theme preferences

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null,
    accessToken: string | null
  },
  theme: {
    mode: 'light' | 'dark'
  }
}
```

## Routing

React Router is used for navigation with the following route structure:

- Public routes:
  - `/login`
  - `/register` 
  - `/auth/forgot-password`
  - `/auth/reset-password/:token`

- Protected routes (require authentication):
  - `/dashboard`
  - `/profile`
  - `/settings`

- Admin routes (require admin role):
  - `/admin/users`

## API Integration

The application communicates with the backend using Axios. The API service is configured in `src/lib/axios.ts` with interceptors for:

- Adding authentication headers
- Handling token refresh
- Error handling

## Component Architecture

Components follow a hierarchical structure:

1. **Layout Components**: Define the overall structure (e.g., DashboardLayout)
2. **Page Components**: Represent entire pages (e.g., Dashboard, Profile)
3. **Feature Components**: Implement specific features
4. **Common Components**: Reusable UI elements

## Styling

The application uses a combination of:

- Material UI's styled components
- Emotion for CSS-in-JS
- Global CSS in `App.css` and `index.css`
- Material UI theming system for consistent styling

## Testing

The project uses Jest and React Testing Library for testing:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Redux Tests**: Test state management logic

To run tests:
```bash
npm run test
```

## Deployment

The application can be deployed using:

1. **Static Build**:
   ```bash
   npm run build
   ```
   The build artifacts will be in the `dist/` directory.

2. **Docker**:
   ```bash
   docker build -t accounting-dashboard .
   docker run -p 80:80 accounting-dashboard
   ```

## Contributing Guidelines

1. **Branching Strategy**:
   - `main`: Production-ready code
   - `develop`: Integration branch
   - Feature branches: `feature/feature-name`
   - Bug fixes: `fix/bug-description`

2. **Code Style**:
   - Follow the ESLint configuration
   - Use TypeScript's strict mode
   - Document complex functions with JSDoc comments

3. **Testing Requirements**:
   - Write tests for all new features
   - Maintain test coverage above 80%

4. **Pull Request Process**:
   - Create a PR against the `develop` branch
   - Ensure all tests pass
   - Get at least one code review
   - Squash commits before merging

---

## Troubleshooting

### Common Issues

1. **Authentication Issues**:
   - Check browser cookies and local storage
   - Verify API endpoints in the authService

2. **Styling Inconsistencies**:
   - Ensure theme provider is wrapping all components
   - Check for conflicting style definitions

3. **API Connection Problems**:
   - Verify API base URL in axios configuration
   - Check network request/response in browser dev tools

---

## Authentication Server Configuration

### Setting the API URL

The application needs to communicate with an authentication server for user login, registration, and other authentication operations. The API URL is configured in `src/lib/axios.ts`.

#### Configuration Options

1. **Environment Variable (Recommended)**:
   
   Create a `.env` or `.env.local` file in the project root with the following variable:
   ```
   VITE_API_URL=https://your-auth-server.com/api
   ```

   This environment variable will be automatically picked up during build and runtime via Vite's environment variable handling.

2. **Default Fallback**:
   
   If no environment variable is set, the system defaults to `http://localhost:3000/api`. You can modify this fallback in the `axios.ts` file:

   ```typescript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
     // rest of the configuration
   });
   ```

3. **Docker Environment**:

   When using Docker, you can set the environment variable in your `docker-compose.yml` file:
   ```yaml
   services:
     app:
       # other configuration
       environment:
         - VITE_API_URL=https://your-auth-server.com/api
   ```

   Or in your Dockerfile:
   ```dockerfile
   ARG VITE_API_URL
   ENV VITE_API_URL=${VITE_API_URL}
   ```

4. **Production Deployment**:

   For production builds, ensure the environment variable is set during the build process:
   ```bash
   VITE_API_URL=https://prod-auth-server.com/api npm run build
   ```

### API Endpoints

The authentication server should implement the following endpoints:

- `/auth/login` - User login
- `/auth/signup` - User registration
- `/auth/logout` - User logout
- `/auth/refresh` - Token refresh
- `/auth/verify-email` - Email verification
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password
- `/protected/profile` - Get user profile
- `/protected/change-password` - Change password

### Testing the API Connection

To test if your API connection is properly configured:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and attempt to log in

3. Check for network requests to your configured API URL

4. If you encounter CORS issues, ensure your backend server allows requests from your frontend domain

---

For more detailed information about specific features, refer to the design documents in the `Design/Blueprints/` directory.