// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../components/authService';
import {jwtDecode} from 'jwt-decode';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser(jwtDecode(token));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setUser(jwtDecode(response.data.access));
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      navigate('/');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Login failed!',
        severity: 'error',
      });
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const register = async (username, email, password) => {
    try {
      await authService.register(username, email, password);
      setSnackbar({
        open: true,
        message: 'Registration successful! Please login.',
        severity: 'success',
      });
      navigate('/login');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Registration failed!',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    user,
    login,
    logout,
    register,
    snackbar,
    handleSnackbarClose,
  };
};
