// src/components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 1.00)' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
            <HomeIcon fontSize="large" />
          </IconButton>
        </Box>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Stock Sorter
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {/* <Button color="inherit" component={Link} to="/add-stock">Add Stock</Button> */}
        <Button color="inherit" component={Link} to="/">Change Password</Button>
        <Button color="inherit" component={Link} to="/login">Log Out</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
