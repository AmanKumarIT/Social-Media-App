import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column', p: 2, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, mt: 2, px: 2, background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => navigate('/')}>
        TaskPlanetFeed
      </Typography>
      
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
          <Avatar src={user.profilePicture} sx={{ width: 48, height: 48, mr: 2, boxShadow: theme.shadows[3] }}>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">@{user.username?.toLowerCase()}</Typography>
          </Box>
        </Box>
      )}

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem button key={item.text} onClick={() => navigate(item.path)} sx={{
              borderRadius: 3, mb: 1,
              backgroundColor: active ? 'rgba(0,0,0,0.04)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' }
            }}>
              <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit' }}>
                {React.cloneElement(item.icon, { sx: { fontSize: active ? 28 : 24, transition: 'all 0.2s' } })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: active ? 'bold' : 'normal', fontSize: '1.1rem' }} 
              />
            </ListItem>
          );
        })}
      </List>

      <List>
        <ListItem button onClick={handleLogout} sx={{ borderRadius: 3, color: 'error.main', '&:hover': { backgroundColor: 'rgba(211,47,47,0.08)' } }}>
          <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 'bold' }}/>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {!isMobile && (
        <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0 }}>
          <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none', boxShadow: '1px 0 10px rgba(0,0,0,0.05)' } }}>
            {drawer}
          </Drawer>
        </Box>
      )}
      
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, pb: { xs: 10, md: 4 } }}>
        {children}
      </Box>

      {isMobile && (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 60, bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
           {menuItems.map((item) => (
             <Box key={item.text} onClick={() => navigate(item.path)} sx={{ p: 1, color: location.pathname === item.path ? 'primary.main' : 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               {item.icon}
             </Box>
           ))}
        </Box>
      )}
    </Box>
  );
};

export default Layout;
