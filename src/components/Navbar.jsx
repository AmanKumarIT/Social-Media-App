import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', color: '#1976d2' }} onClick={() => navigate('/')}>
          TaskPlanetFeed
        </Typography>
        <Box>
          {token ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="primary" variant="contained" disableElevation onClick={() => navigate('/signup')} sx={{ ml: 1, borderRadius: '20px' }}>Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
