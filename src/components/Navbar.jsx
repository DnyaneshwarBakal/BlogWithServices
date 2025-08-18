import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

// --- NEW: Import the ConfirmationDialog component ---
import ConfirmationDialog from './ConfirmationDialog'; // Make sure the path is correct

const navItems = [
  { text: 'Blog', path: '/blog' },
  { text: 'Services', path: '/services' },
  { text: 'About', path: '/about' },
  { text: 'Contact', path: '/contact' },
  { text: 'Team', path: '/team' },
  { text: 'HDFCGPT', path: '/hdfcgpt' },
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

  // --- NEW: State for controlling the logout confirmation dialog ---
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);

  // --- UPDATED: This function now runs only AFTER the user confirms the action ---
  const handleConfirmLogout = async () => {
    setIsLogoutDialogOpen(false); // Close the dialog first
    try {
      await logout();
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // --- UPDATED: The mobile drawer now opens the confirmation dialog ---
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
            {/* UPDATED: onClick now opens the dialog */}
            <ListItemButton onClick={() => setIsLogoutDialogOpen(true)} sx={{ justifyContent: 'center' }}>
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
          
          <Box component={RouterLink} to="/" sx={{ flexGrow: 1, display: {xs: 'none', sm: 'block'} }}>
            <Logo />
          </Box>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.text} component={RouterLink} to={item.path} sx={{ color: '#fff' }}>
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: {xs: 'block', sm: 'none'} }} />

          {/* --- UPDATED: Login/Logout Buttons for Desktop --- */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentUser ? (
              // UPDATED: onClick now opens the dialog
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => setIsLogoutDialogOpen(true)}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" startIcon={<LoginIcon />} onClick={openLoginModal}>
                Login
              </Button>
            )}
          </Box>
          
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

      {/* --- NEW: Render the ConfirmationDialog --- */}
      <ConfirmationDialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to sign out?"
        confirmButtonColor="#d32f2f" // Custom red color for confirmation
      />
    </Box>
  );
}

export default Navbar;