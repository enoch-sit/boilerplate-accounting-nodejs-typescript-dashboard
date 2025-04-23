import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { getCurrentUser } from './features/auth/authSlice';
import { useAppSelector } from './hooks/useRedux';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register.tsx';
import ForgotPassword from './components/auth/recovery/ForgotPassword';
import ResetPassword from './components/auth/recovery/ResetPassword';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';
import UserManagement from './components/admin/UserManagement';

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute';

// Theme integration
const AppContent: React.FC = () => {
  const { mode } = useAppSelector((state) => state.theme);
  
  // Create a theme based on the current mode setting
  const theme = createTheme({
    palette: {
      mode: mode === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#272727' : '#1976d2',
          },
        },
      },
    },
  });

  useEffect(() => {
    // Attempt to restore user session on app load
    store.dispatch(getCurrentUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected dashboard routes */}
          <Route element={
            <ProtectedRoute />
          }>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Catch all undefined dashboard routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['admin']} />
              }>
                <Route index element={<UserManagement />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
