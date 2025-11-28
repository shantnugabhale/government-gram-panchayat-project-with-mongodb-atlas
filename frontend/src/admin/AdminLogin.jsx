import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Paper, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setToken } from '@/services/auth';

const FALLBACK_EMAIL =
  import.meta.env?.VITE_ADMIN_FALLBACK_EMAIL || "gabhaledharmraj@gmail.com";
const FALLBACK_PASSWORD =
  import.meta.env?.VITE_ADMIN_FALLBACK_PASSWORD || "gabhaledharmraj@gmail.com";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      if (username === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
        setToken("demo-admin-token");
        navigate("/admin/panel");
        return;
      }

      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: username,
        password,
      });

      const token = data?.token;
      if (token) {
        setToken(token);
      } else {
        console.warn('API did not return a token');
      }
      navigate('/admin/panel');
    } catch (error) {
      console.error('Login error:', error);
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? 'Incorrect email or password'
          : 'Login failed. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email: resetEmail,
      });
      setResetSuccess(true);
      setForgotPasswordOpen(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      const message =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? 'No account found with this email address'
          : 'Failed to send reset email. Please try again.');
      setError(message);
    }
  };
  
  const handleBack = () => {
    navigate('/'); // वेबसाईटच्या होमपेजवर परत जा
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email Address"
              name="username"
              type="email"
              autoComplete="email"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => setForgotPasswordOpen(true)}
              disabled={loading}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Forgot Password?
            </Button>

            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Website
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} variant="contained">
            Send Reset Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={resetSuccess}
        autoHideDuration={6000}
        onClose={() => setResetSuccess(false)}
      >
        <Alert onClose={() => setResetSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Password reset email sent! Please check your inbox.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;