// src/components/NavBar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
            <HomeIcon fontSize="large" />
          </IconButton>
        </Box>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Stock Sorter
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/add-stock">Add Stock</Button>
            <Button color="inherit" component={Link} to="/change-password">Change Password</Button>
            <Button color="inherit" onClick={logout}>Log Out</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
