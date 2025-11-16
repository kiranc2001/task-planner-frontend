import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { authAPI } from '../services/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { AuthForm, User } from '../types';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<AuthForm>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isSignup
        ? await authAPI.signup({ ...formData, name: formData.name || '' })
        : await authAPI.signin(formData);
      const loggedUser = res as User;
      setUser(loggedUser);

      // Sync save
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('userId', loggedUser.id.toString());
      console.log('Saved userId to localStorage:', loggedUser.id);

      // Delay navigate
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: unknown) {
      // Fixed: Extract specific backend message from response
      const axiosErr = err as any;
      let errorMessage = 'Error occurred';
      if (axiosErr.response) {
        // Backend sent custom error (400/401/404/409)
        errorMessage =
          axiosErr.response.data?.message ||
          axiosErr.response.data?.email ||
          axiosErr.response.statusText ||
          `Server error (${axiosErr.response.status})`;
      } else if (axiosErr.request) {
        errorMessage = 'Network error—check backend is running';
      } else {
        errorMessage = axiosErr.message || 'Unknown error';
      }
      setError(errorMessage);
      console.error('Login error details:', err); // Full log for debug
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Typography>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            onClick={() => setIsSignup(!isSignup)}
            sx={{ mt: 2 }}
          >
            {isSignup ? 'Switch to Sign In' : 'Switch to Sign Up'}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              /* TODO: Open forgot modal */ console.log(
                'Forgot password clicked'
              );
            }}
            sx={{ mt: 1 }}
          >
            Forgot Password?
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
