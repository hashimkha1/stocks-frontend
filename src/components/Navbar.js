import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = ({ countryFlag }) => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/stocks');
  };

  return (
    <AppBar position="static" sx= {{backgroundColor: '#ee0979'}}>
      <Toolbar>
        {countryFlag && (
          <Box sx={{ padding: 1 }}>
            <img src={countryFlag} alt="Country Flag" style={{ width: '50px' }} />
          </Box>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft: 15 }}>
          
        </Typography>
        {authenticated && (
          <>
            <Button color="inherit" component={Link} to="/change-password">
              Change Password
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
