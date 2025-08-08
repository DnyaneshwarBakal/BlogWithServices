 import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Button,
  Link,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityIcon from '@mui/icons-material/Visibility';

// --- YOUR DETAILS ---
const userDetails = {
  name: 'Dnyaneshwar Bakal',
  title: 'Software Engineer at HDFC BANK',
  phone: '8975640978',
  email: 'dnyaneshwarbakal89@gmail.com',
  imageUrl: '/dnyanesh1.jpeg', // Make sure this image is in your /public folder
};

// Styles for the header text to ensure it's readable on both gradients
const headerTextStyles = (theme) => ({
  color: theme.palette.mode === 'light' ? '#1f2937' : 'white', // Dark grey for light mode, white for dark
});

function About() {
  return (
    // ======================================================================
    // == THE FIX: The entire page is wrapped in a Box with the gradient   ==
    // ======================================================================
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
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Card Section */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
          <Card
            raised
            sx={{
              maxWidth: 400,
              width: '100%',
              borderRadius: 1,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              bgcolor: 'background.paper', // Ensure card has its own opaque background
            }}
          >
            <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={userDetails.imageUrl}
                sx={{
                  width: 130,
                  height: 160,
                  bgcolor: 'primary.main',
                  fontSize: '4.5rem',
                }}
              >
                {!userDetails.imageUrl && <PersonIcon fontSize="inherit" />}
              </Avatar>
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" gutterBottom color="text.primary">
                {userDetails.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  {userDetails.title}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'left', mt: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <PhoneIcon sx={{ color: 'text.secondary', mr: 2 }} />
                  <Link href={`tel:${userDetails.phone}`} underline="hover" color="inherit">
                    <Typography variant="body1">{userDetails.phone}</Typography>
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ color: 'text.secondary', mr: 2 }} />
                  <Link href={`mailto:${userDetails.email}`} underline="hover" color="inherit">
                    <Typography variant="body1">{userDetails.email}</Typography>
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Introduction Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={headerTextStyles}>
            About Me
          </Typography>
          <Typography variant="h6" sx={(theme) => ({...headerTextStyles(theme), opacity: 0.8 })}>
            A passionate developer dedicated to creating innovative solutions that make a difference.
          </Typography>
        </Box>

        {/* Mission and Story Section */}
        <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <TimelineIcon color="primary" sx={{mr: 1}}/>
                <Typography variant="h5" component="h2">My Journey</Typography>
              </Box>
              <Typography variant="body1">
                My journey in technology started with a simple idea: to build things that solve real-world problems. From learning the basics to tackling complex enterprise-level projects, my focus has always been on quality, efficiency, and continuous learning.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <VisibilityIcon color="primary" sx={{mr: 1}}/>
                <Typography variant="h5" component="h2">My Mission</Typography>
              </Box>
              <Typography variant="body1">
                My mission is to leverage my skills in software engineering to build robust, scalable, and intuitive applications. I strive to push the boundaries of what's possible and to contribute positively to any team I am a part of.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Call to Action Section */}
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Interested in connecting?
          </Typography>
          <Typography variant="body1" sx={{mb: 2}}>
            Let's build something amazing together. Reach out to me via the contact page.
          </Typography>
          <Button component={RouterLink} to="/contact" variant="contained" color="secondary" size="large">
            Get in Touch
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default About;