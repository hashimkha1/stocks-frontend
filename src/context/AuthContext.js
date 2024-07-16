import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = async (password) => {
    try {
      const response = await axios.post('https://discipleshiptrails.com/backend/api/login/', { password });
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
      const response = await axios.post('https://discipleshiptrails.com/backend/api/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred while changing the password';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, login, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
