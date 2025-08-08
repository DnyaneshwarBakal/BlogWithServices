import React, { useState, useMemo, useEffect } from 'react'; // 1. Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import Blog from './components/Blog.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

const gradientAnimation = {
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
};

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

  // ======================================================================
  // == ADDED FUNCTIONALITY: Disable Right-Click and DevTools shortcuts  ==
  // ======================================================================
  useEffect(() => {
    // Handler to prevent the context menu (right-click)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Handler to block certain key combinations
    const handleKeyDown = (e) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      // Block Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
      }
      // Block Ctrl+U
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // The empty dependency array ensures this runs only once.

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <GlobalStyles styles={gradientAnimation} />
        <Navbar mode={mode} toggleColorMode={toggleColorMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;