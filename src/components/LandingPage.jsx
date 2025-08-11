// src/components/LandingPage.jsx

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function LandingPage() {
  return (
    // This Box no longer needs background styles, it just handles layout
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Take up full height of the parent layout box
        textAlign: 'center',
        color: 'white', // Ensure text is visible on the gradient
        py: 4, // Add vertical padding
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Welcome to DS Technologies
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Your one-stop solution for innovative web services and insightful articles. Explore our offerings or head straight to our blog.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/blog"
          sx={{
            backgroundColor: 'white',
            color: '#FF8E53',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          Go to the Blog
        </Button>
      </Container>
    </Box>
  );
}

export default LandingPage;