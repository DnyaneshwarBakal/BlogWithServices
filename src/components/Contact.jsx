// contact details

import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box,
  InputAdornment, CircularProgress, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';

// Firebase imports remain the same
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- React Hook Form and Yup Imports ---
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import contactSchema from '../validation/contactSchema';
function Contact() {
  //  
  // We only need state for notifications, not for form data or errors.
  const [notification, setNotification] = useState({
    open: false, message: '', severity: 'success'
  });

  // --- React Hook Form Initialization ---
  const {
    register,           // Function to connect inputs to the form
    handleSubmit,       // Wrapper for our submission handler that triggers validation
    formState: { errors, isSubmitting }, // Object containing form state (errors, submitting status)
    reset,              // Function to reset the form fields
  } = useForm({
    resolver: yupResolver(contactSchema), // This is the magic connector!
    defaultValues: { // Set default values here
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  
  // It only receives the data if validation has passed.
  const onSubmit = async (data) => {
    handleCloseNotification(); // Close any previous notifications
    try {
      await addDoc(collection(db, "contacts"), {
        ...data,
        timestamp: serverTimestamp(),
      });
      setNotification({
        open: true,
        message: `Thank you, ${data.name}! Your message has been sent.`,
        severity: 'success',
      });
      reset(); // Reset the form fields to their default values
    } catch (e) {
      setNotification({
        open: true,
        message: 'There was an error sending your message. Please try again later.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        {notification.open && (
          <Alert severity={notification.severity} onClose={handleCloseNotification} sx={{ width: '100%', mb: 2 }}>
            {notification.message}
          </Alert>
        )}

        <Typography variant="h4" component="h1" gutterBottom>Contact Us</Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Have a question or want to work with us? Drop us a message below!
        </Typography>

        {/* We now use handleSubmit from React Hook Form, passing our onSubmit function */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} noValidate>
          {/* --- Fields are now registered --- */}
          <TextField
            fullWidth required margin="normal" label="Full Name"
            {...register('name')} // The `register` function connects this field
            error={!!errors.name}
            helperText={errors.name?.message} // Access the error message from the form state
            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
          />
          <TextField
            fullWidth required margin="normal" label="Email Address" type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
          />
          <TextField
            fullWidth required margin="normal" label="10-Digit Mobile Number" type="tel"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }}
          />
          <TextField
            fullWidth required margin="normal" label="Your Message" multiline rows={4}
            {...register('message')}
            error={!!errors.message}
            helperText={errors.message?.message}
            InputProps={{ startAdornment: (<InputAdornment position="start"><MessageIcon /></InputAdornment>) }}
          />
          <Button
            type="submit" fullWidth variant="contained"
            disabled={isSubmitting} // Use `isSubmitting` from React Hook Form
            endIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Contact;