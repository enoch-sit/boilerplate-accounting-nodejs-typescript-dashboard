import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  DeleteForever as DeleteForeverIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import authService from '../../services/authService';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { mode, changeTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [settings, setSettings] = useState({
    theme: mode,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      desktop: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30, // minutes
    }
  });

  // Password reset form state
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Update settings when theme mode changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: mode
    }));
  }, [mode]);

  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section as keyof typeof prevSettings] as Record<string, any>,
        [setting]: value
      }
    }));
  };

  const handleSimpleChange = (setting: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));

    // Apply theme change immediately
    if (setting === 'theme') {
      changeTheme(value);
    }
  };

  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showNotification('Settings saved successfully', 'success');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    // and then make an API call to delete the account
    showNotification('This would delete your account in a real application', 'warning');
  };

  const handlePasswordReset = async () => {
    if (!passwordResetEmail) {
      showNotification('Please enter your email', 'error');
      return;
    }
    
    setPasswordResetLoading(true);
    try {
      await authService.forgotPassword(passwordResetEmail);
      showNotification('Password reset link sent to your email', 'success');
      setPasswordResetEmail('');
    } catch (error) {
      showNotification('Failed to send password reset email', 'error');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('All password fields are required', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 8) {
      showNotification('Password must be at least 8 characters', 'error');
      return;
    }
    
    setPasswordChangeLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      showNotification('Password changed successfully', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showNotification('Failed to change password', 'error');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Customize your application experience.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Appearance Settings */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DarkModeIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Appearance</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                label="Theme"
                onChange={(e) => handleSimpleChange('theme', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.accessibility.highContrast}
                  onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                />
              }
              label="High Contrast Mode"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.accessibility.largeText}
                  onChange={(e) => handleSettingChange('accessibility', 'largeText', e.target.checked)}
                />
              }
              label="Large Text"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.accessibility.screenReader}
                  onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                />
              }
              label="Screen Reader Support"
            />
          </Paper>
        </Grid>
        
        {/* Localization Settings */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Localization</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleSimpleChange('language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone}
                label="Timezone"
                onChange={(e) => handleSimpleChange('timezone', e.target.value)}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">Eastern Time (EST)</MenuItem>
                <MenuItem value="CST">Central Time (CST)</MenuItem>
                <MenuItem value="MST">Mountain Time (MST)</MenuItem>
                <MenuItem value="PST">Pacific Time (PST)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.dateFormat}
                label="Date Format"
                onChange={(e) => handleSimpleChange('dateFormat', e.target.value)}
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Profile Management */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Profile Management</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Account Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Username:</strong> {user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Role:</strong> {user?.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Member Since:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </Typography>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => showNotification('Profile editing functionality would be implemented here', 'info')}
              fullWidth
              sx={{ mb: 2 }}
            >
              Edit Profile
            </Button>
            
            <Typography variant="subtitle2" gutterBottom>
              Password Reset
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              value={passwordResetEmail}
              onChange={(e) => setPasswordResetEmail(e.target.value)}
              margin="normal"
              type="email"
              placeholder="Enter your email"
            />
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handlePasswordReset}
              disabled={passwordResetLoading}
              fullWidth
              sx={{ mt: 1 }}
            >
              {passwordResetLoading ? <CircularProgress size={24} /> : 'Send Password Reset Email'}
            </Button>
          </Paper>
        </Grid>
        
        {/* Security Settings */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Change Password
            </Typography>
            
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordInputChange}
              margin="normal"
              type="password"
            />
            
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordInputChange}
              margin="normal"
              type="password"
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordInputChange}
              margin="normal"
              type="password"
            />
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={handlePasswordChange}
              disabled={passwordChangeLoading}
              fullWidth
              sx={{ mt: 2, mb: 3 }}
            >
              {passwordChangeLoading ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mb: 3 }}>
              Add an extra layer of security to your account by requiring a verification code.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Session Timeout (minutes)
              </Typography>
              <TextField
                type="number"
                size="small"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                inputProps={{ min: 5, max: 120 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Your account will be logged out after this period of inactivity.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
              }
              label="Email Notifications"
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mb: 2 }}>
              Receive notifications via email about account activity and security alerts.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
              }
              label="Push Notifications"
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mb: 2 }}>
              Receive push notifications on your mobile device.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.desktop}
                  onChange={(e) => handleSettingChange('notifications', 'desktop', e.target.checked)}
                />
              }
              label="Desktop Notifications"
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Show notifications on your desktop when you're using the app in a browser.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Action Buttons */}
        <Grid component="div" sx={{ gridColumn: "span 12" }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save All Settings'}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Danger Zone */}
        <Grid component="div" sx={{ gridColumn: "span 12" }}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffebee' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error">Danger Zone</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DeleteForeverIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Delete All Data"
                  secondary="This will permanently delete all your data from our servers. This action cannot be undone."
                />
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showNotification('This would delete all your data in a real application', 'error')}
                >
                  Delete Data
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;