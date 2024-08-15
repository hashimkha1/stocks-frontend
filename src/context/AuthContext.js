import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setAuthenticated(true);
    }
  }, []);

  const login = async (password) => {
    try {
      const response = await axios.post('https://discipleshiptrails.com/backend/api/login/', { password });
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      setAuthenticated(true);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred during login';
      return { success: false, message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axios.post(
        'https://discipleshiptrails.com/backend/api/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred while changing the password';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, token, login, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
