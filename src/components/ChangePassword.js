import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { user, snackbar, handleSnackbarClose } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/change-password/', {
        old_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.status === 'password set') {
        handleSnackbarClose({
          open: true,
          message: 'Password changed successfully!',
          severity: 'success',
        });
        navigate('/');
      } else {
        handleSnackbarClose({
          open: true,
          message: 'Failed to change password!',
          severity: 'error',
        });
      }
    } catch (err) {
      handleSnackbarClose({
        open: true,
        message: 'Failed to change password!',
        severity: 'error',
      });
      console.error(err);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            Change Password
          </Button>
        </form>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => handleSnackbarClose({ ...snackbar, open: false })}>
          <Alert onClose={() => handleSnackbarClose({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ChangePassword;
