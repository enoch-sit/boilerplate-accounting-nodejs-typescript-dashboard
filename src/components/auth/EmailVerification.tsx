import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  TextField,
  Link
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { verifyEmail, resendVerification } from '../../features/auth/authSlice';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'idle'>(
    token ? 'pending' : 'idle'
  );
  const [error, setError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState(email);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Automatically verify if token is present in URL
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await dispatch(verifyEmail(token)).unwrap();
          setVerificationStatus('success');
        } catch (err: any) {
          setVerificationStatus('error');
          setError(err.toString());
        }
      }
    };
    
    if (token) {
      verifyToken();
    }
  }, [token, dispatch]);
  
  const handleResendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!resendEmail) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(resendVerification(resendEmail)).unwrap();
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.toString() || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Email Verification
        </Typography>
        
        {/* When automatically verifying token from URL */}
        {verificationStatus === 'pending' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {verificationStatus === 'success' && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your email has been successfully verified!
            </Alert>
            <Typography variant="body2" paragraph>
              Your account is now activated. You can now login to access your account.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        )}
        
        {verificationStatus === 'error' && (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'Verification failed. The link may have expired or is invalid.'}
            </Alert>
            <Typography variant="body2" paragraph>
              Please request a new verification link below.
            </Typography>
            <Box component="form" onSubmit={handleResendVerification} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Resend Verification Link'}
              </Button>
            </Box>
          </Box>
        )}
        
        {/* When user manually visits the verification page */}
        {verificationStatus === 'idle' && !resendSuccess && (
          <Box component="form" onSubmit={handleResendVerification} noValidate>
            <Typography variant="body2" color="text.secondary" paragraph align="center">
              Please enter your email address to receive a verification link.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Verification Link'}
            </Button>
          </Box>
        )}
        
        {/* After successfully requesting a new verification email */}
        {resendSuccess && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Verification link sent! Please check your email.
            </Alert>
            <Typography variant="body2" paragraph>
              If you don't receive an email within a few minutes, please check your spam folder.
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </Box>
        )}
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link 
            component={RouterLink}
            to="/login" 
            variant="body2" 
          >
            Already verified? Sign in here
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmailVerification;