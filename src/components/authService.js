// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const register = (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios.post(API_URL + 'login/', {
    username,
    password,
  });
};

const logout = () => {
  return axios.post(API_URL + 'logout/', {
    refresh: localStorage.getItem('refreshToken'),
  });
};

export default {
  register,
  login,
  logout,
};
