import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      setSnackbarMessage(result.message);
      setSnackbarSeverity('success');
      navigate('/home');
    } else {
      setError(result.message);
      setSnackbarMessage(result.message);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };
 

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: 300, margin: '0 auto', marginTop: 10 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          type="password"
          label="Old Password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          type="password"
          label="New Password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Change Password
        </Button>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
