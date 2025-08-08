 import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // A single state object to hold all validation errors
  const [errors, setErrors] = useState({});

  // Function to validate a single field
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) {
          error = 'Full Name is required.';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = 'Full Name can only contain letters and spaces.';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email Address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Mobile Number is required.';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Please enter a valid 10-digit mobile number.';
        }
        break;
      case 'message':
        if (!value) {
          error = 'Message is required.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Special handling for the phone number to allow only numbers
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        if (errors[name]) { // Clear error on change if it exists
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
       if (errors[name]) { // Clear error on change if it exists
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach((name) => {
      const error = validateField(name, formData[name]);
      if (error) {
        validationErrors[name] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are errors
    }
    
    // If form is valid, proceed with submission
    console.log('Form Submitted:', formData);
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form
    setErrors({}); // Clear all errors
  };

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
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
            elevation={6} 
            sx={{ 
                p: { xs: 2, sm: 4 },
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                borderRadius: 2,
            }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Have a question or want to work with us? Drop us a message below!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} noValidate>
            <TextField
              fullWidth required margin="normal" label="Full Name" name="name"
              value={formData.name} onChange={handleChange} onBlur={handleBlur}
              error={!!errors.name} helperText={errors.name}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
            />
            <TextField
              fullWidth required margin="normal" label="Email Address" name="email" type="email"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              error={!!errors.email} helperText={errors.email}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
            />
            <TextField
              fullWidth required margin="normal" label="10-Digit Mobile Number" name="phone" type="tel"
              value={formData.phone} onChange={handleChange} onBlur={handleBlur}
              error={!!errors.phone} helperText={errors.phone}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }}
            />
            <TextField
              fullWidth required margin="normal" label="Your Message" name="message" multiline rows={4}
              value={formData.message} onChange={handleChange} onBlur={handleBlur}
              error={!!errors.message} helperText={errors.message}
              InputProps={{ startAdornment: (<InputAdornment position="start"><MessageIcon /></InputAdornment>) }}
            />
            <Button type="submit" fullWidth variant="contained" endIcon={<SendIcon />} sx={{ mt: 2, py: 1.5 }}>
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Contact;