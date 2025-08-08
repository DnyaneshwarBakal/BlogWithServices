import React from 'react';
import { Typography, Box } from '@mui/material';

// ======================================================================
// == THE FIX: The function name is now "HomePage" (PascalCase) to     ==
// == match the export and the import statement in App.jsx.            ==
// ======================================================================
function HomePage() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
            : 'linear-gradient(-45deg, #023, #023e8a, #0077b6, #0096c7)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Welcome to Our Website
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        Explore our services, read our blog, and get in touch!
      </Typography>
    </Box>
  );
}

// The export name is correct and now matches the function name.
export default HomePage;