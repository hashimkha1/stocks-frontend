// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://www.discipleshiptrails.com/api/stocks/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('token')}`,
  },
});

export default instance;
