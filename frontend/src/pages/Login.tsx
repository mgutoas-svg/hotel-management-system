import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Paper, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register } from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest } from '../types';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [tab, setTab] = useState(0);

  const [loginData, setLoginData] = useState<LoginRequest>({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleLogin = async () => {
    const result = await dispatch(login(loginData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const handleRegister = async () => {
    const result = await dispatch(register(registerData));
    if (result.meta.requestStatus === 'fulfilled') {
      setTab(0);
      setLoginData({ email: registerData.email, password: registerData.password });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h3" sx={{ marginBottom: 2 }}>
          🏨 Hotel Management
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ width: '100%', marginTop: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <Box sx={{ padding: 3 }}>
            {tab === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <Button variant="contained" fullWidth onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <Button variant="contained" fullWidth onClick={handleRegister} disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
