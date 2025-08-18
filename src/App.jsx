// File: src/App.jsx (Updated)

import React, { useState, useMemo, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { GlobalStyles } from '@mui/material';

// --- COMPONENT IMPORTS ---
import Navbar from './components/Navbar';
import Team from './components/Team';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import HdfcGpt from './components/HdfcGpt'; // <-- 1. IMPORT THE NEW HDFCGPT COMPONENT

const gradientAnimation = {
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
};

const AppLayout = ({ mode, toggleColorMode }) => (
  <>
    <Navbar mode={mode} toggleColorMode={toggleColorMode} />
    <Box
      component="main"
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(-45deg, #ee7752, #ddf0a5ff, #23a6d5, #23d5ab)'
            : 'linear-gradient(-45deg, #023, #023e8a, #edeff0ff, #0096c7)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        // Removed py: 4 to allow the HdfcGpt page to control its own padding
        // and fill the full height.
      }}
    >
      <Outlet />
    </Box>
  </>
);

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    },
  }), [mode]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout mode={mode} toggleColorMode={toggleColorMode} />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blog/:id', element: <BlogDetail /> },
        { path: 'services', element: <Services /> },
        { path: 'contact', element: <Contact /> }, 
        { path: 'team', element: <Team /> },
        { path: 'about', element: <About /> },
        // --- THIS IS THE FIX ---
        { path: 'hdfcgpt', element: <HdfcGpt /> }, // <-- 2. ADD THE ROUTE FOR THE NEW PAGE
      ],
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={gradientAnimation} />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;