import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// --- UPDATED navItems array ---
const navItems = [
  { text: 'Blog', path: '/blog' },
  { text: 'Services', path: '/services' },
  { text: 'About', path: '/about' },
  { text: 'Contact', path: '/contact' },
  { text: 'Team', path: '/team' }, // Added Team page
];

const Logo = () => (
  <img 
    src="/dsTech.jpeg"
    alt="DS Technologies Logo" 
    style={{ height: 40, verticalAlign: 'middle' }}
  />
);

function Navbar({ mode, toggleColorMode }) {
  const { currentUser, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box component={RouterLink} to="/" sx={{ my: 2, display: 'inline-block' }}>
        <Logo />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {currentUser ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ justifyContent: 'center' }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1, justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={openLoginModal} sx={{ justifyContent: 'center' }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1, justifyContent: 'center' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Box component={RouterLink} to="/" sx={{ flexGrow: 1, display: {xs: 'none', sm: 'block'} }}>
            <Logo />
          </Box>
          
          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.text} component={RouterLink} to={item.path} sx={{ color: '#fff' }}>
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Spacer to push subsequent items to the right */}
          <Box sx={{ flexGrow: 1, display: {xs: 'block', sm: 'none'} }} />

          {/* Login/Logout Buttons for Desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentUser ? (
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" startIcon={<LoginIcon />} onClick={openLoginModal}>
                Login
              </Button>
            )}
          </Box>
          
          {/* Theme Toggle Button */}
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navbar;