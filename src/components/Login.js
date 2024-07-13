
// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api-auth/login/', formData)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        // redirect to stock list page
      })
      .catch(error => console.error(error));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="username" label="Username" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="password" label="Password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
