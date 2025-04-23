import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Reset Your Password
        </Typography>
        
        {!success ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" color="text.secondary" paragraph align="center">
              Enter your email address and we'll send you a link to reset your password.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link 
                href="#" 
                variant="body2" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset link sent! Please check your email.
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
      </Paper>
    </Container>
  );
};

export default ForgotPassword;