import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  PersonAddAlt as PersonAddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  });
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'acceptTerms' ? checked : value
    }));
    
    // Clear field-specific error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear any API errors when user changes input
    if (error) {
      clearError();
    }
  };
  
  const validateStep = (step: number): boolean => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (step === 0) {
      // Validate username
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        valid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
        valid = false;
      }
      
      // Validate email
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        valid = false;
      }
    } else if (step === 1) {
      // Validate password
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
      
      // Validate password confirmation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        valid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    } else if (step === 2) {
      // Validate terms acceptance
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });
    
    if (result.success) {
      setRegistrationSuccess(true);
      setActiveStep(3); // Move to success step
    }
  };
  
  const steps = ['Account Information', 'Create Password', 'Terms & Conditions'];
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body1" gutterBottom>
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Please read them carefully before proceeding.
            </Typography>
            <Box sx={{ mt: 2, mb: 2, height: 100, overflowY: 'auto', p: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="body2" paragraph>
                This is a sample Terms of Service agreement. In a real application, this would contain the actual terms and conditions, privacy policy, and other legal information that users need to agree to before creating an account.
              </Typography>
              <Typography variant="body2" paragraph>
                The agreement would typically cover user responsibilities, data handling practices, intellectual property rights, disclaimers, and other legal aspects of using the service.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox 
                  color="primary" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="I accept the terms and conditions"
            />
            {formErrors.acceptTerms && (
              <Typography color="error" variant="caption" display="block">
                {formErrors.acceptTerms}
              </Typography>
            )}
          </>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Avatar sx={{ m: 1, bgcolor: 'success.main', mx: 'auto' }}>
              <CheckIcon />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Your account has been created successfully. Please check your email to verify your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {!registrationSuccess && (
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <PersonAddIcon />
            </Avatar>
          )}
          
          <Typography component="h1" variant="h5" gutterBottom>
            {registrationSuccess ? '' : 'Create an Account'}
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4, mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0 || activeStep === 3}
                onClick={handleBack}
                sx={{ visibility: activeStep === 0 || activeStep === 3 ? 'hidden' : 'visible' }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 3}
                  sx={{ visibility: activeStep === 3 ? 'hidden' : 'visible' }}
                >
                  Next
                </Button>
              )}
            </Box>
            
            {activeStep !== 3 && (
              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;