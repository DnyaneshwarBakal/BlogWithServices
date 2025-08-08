import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, InputBase, alpha, styled,
} from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';

// --- Styled Components (No Change) ---
const Search = styled('div')(({ theme }) => ({ position: 'relative', borderRadius: theme.shape.borderRadius, backgroundColor: alpha(theme.palette.common.white, 0.15), '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) }, marginLeft: theme.spacing(2), width: 'auto' }));
const SearchIconWrapper = styled('div')(({ theme }) => ({ padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }));
const StyledInputBase = styled(InputBase)(({ theme }) => ({ color: 'inherit', '& .MuiInputBase-input': { padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)})`, transition: theme.transitions.create('width'), width: '100%', [theme.breakpoints.up('md')]: { width: '20ch', '&:focus': { width: '30ch' } } } }));

const navItems = [
  { text: 'Blog', path: '/blog' },
  { text: 'Services', path: '/services' },
  { text: 'About', path: '/about' },
  { text: 'Contact', path: '/contact' },
];

function Navbar({ mode, toggleColorMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);
  const location = useLocation();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>MyLogo</Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ display: { xs: 'none', sm: 'block' }, color: 'inherit', textDecoration: 'none' }}>
            MyLogo
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
            {navItems.map((item) => (
              <Button key={item.text} component={RouterLink} to={item.path} sx={{ color: '#fff' }}>
                {item.text}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navbar;