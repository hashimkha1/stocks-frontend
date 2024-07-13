// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Token ${localStorage.getItem('token')}`,
  },
});

export default instance;
