import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateUserProfile, logoutAllDevices } from '../../features/auth/authSlice';
import authService from '../../services/authService';

interface ProfileData {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  contactInfo: {
    phone: string;
    alternateEmail: string;
    address: string;
  };
}

const defaultProfileData: ProfileData = {
  firstName: '',
  lastName: '',
  displayName: '',
  bio: '',
  contactInfo: {
    phone: '',
    alternateEmail: '',
    address: ''
  }
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Simulate fetching profile data
  useEffect(() => {
    if (user) {
      setLoading(true);
      // In a real app, you would fetch profile data from an API
      // For now, we'll simulate a delay and use default data with username
      setTimeout(() => {
        setProfileData({
          ...defaultProfileData,
          displayName: user.username || '',
          firstName: user.username ? user.username.split(' ')[0] || '' : '',
          lastName: user.username ? user.username.split(' ')[1] || '' : ''
        });
        setLoading(false);
      }, 800);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof ProfileData] as Record<string, any>,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    
    try {
      // Prepare the user data for update
      const userData = {
        username: user?._id ? user.username : '', // Keep existing username
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: profileData.displayName,
        // Add other fields as needed by your API
      };
      
      await dispatch(updateUserProfile(userData)).unwrap();
      showNotification('Profile updated successfully', 'success');
    } catch (error: any) {
      showNotification(error.toString() || 'Failed to update profile', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setLogoutAllLoading(true);
    try {
      await dispatch(logoutAllDevices()).unwrap();
      // The user will be logged out from the current device too, so redirect to login
      navigate('/login');
    } catch (error: any) {
      setLogoutDialogOpen(false);
      showNotification(error.toString() || 'Failed to logout from all devices', 'error');
      setLogoutAllLoading(false);
    }
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage your personal information and account settings.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main'
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {profileData.displayName || user?.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Role: {user?.role}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Username"
                    secondary={user?.username}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Member Since"
                    secondary={new Date(user?.createdAt || '').toLocaleDateString()}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Login"
                    secondary={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Status"
                    secondary={user?.status}
                  />
                </ListItem>
              </List>
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/settings')}
              >
                Security Settings
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={<LogoutIcon />}
                onClick={() => setLogoutDialogOpen(true)}
              >
                Logout From All Devices
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Profile Edit Form */}
        <Grid component="div" sx={{ gridColumn: { xs: "span 12", md: "span 8" } }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" sx={{ gridColumn: { xs: "span 12" } }}>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="This is how your name will appear throughout the application"
                />
              </Grid>
              
              <Grid component="div" sx={{ gridColumn: { xs: "span 12" } }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                  helperText="Tell us a little about yourself"
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="contactInfo.phone"
                  value={profileData.contactInfo.phone}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                <TextField
                  fullWidth
                  label="Alternative Email"
                  name="contactInfo.alternateEmail"
                  value={profileData.contactInfo.alternateEmail}
                  onChange={handleInputChange}
                  margin="normal"
                  type="email"
                />
              </Grid>
              
              <Grid component="div" sx={{ gridColumn: { xs: "span 12" } }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="contactInfo.address"
                  value={profileData.contactInfo.address}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={saveLoading}
              >
                {saveLoading ? <CircularProgress size={24} /> : 'Save Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Logout from all devices dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Logout from all devices?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will terminate all active sessions across all your devices. You will need to log in again on each device.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLogoutDialogOpen(false)} 
            disabled={logoutAllLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutAllDevices} 
            color="error" 
            disabled={logoutAllLoading}
            autoFocus
          >
            {logoutAllLoading ? <CircularProgress size={24} /> : 'Logout All Devices'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Profile;