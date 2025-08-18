import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Link,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const auth = getAuth(app);

// --- Constants and Initial States for Multi-Step Form ---
const steps = ['Personal Information', 'Account Details', 'Review & Create'];
const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const initialErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};


function Login({ open, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  // --- State for Multi-Step Registration ---
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // --- General Functions ---

  const handleClose = () => {
    onClose();
    // Delay resetting state to avoid flash of content change
    setTimeout(() => {
      setIsRegistering(false);
      setError('');
      setErrors(initialErrors);
      setFormData(initialFormData);
      setActiveStep(0);
    }, 300);
  };

  const toggleMode = () => {
    setError('');
    setErrors(initialErrors);
    if (isRegistering) {
      // If switching from Register to Login, reset everything
      setFormData(initialFormData);
      setActiveStep(0);
    }
    setIsRegistering(!isRegistering);
  };


  // --- Login-Specific Logic ---

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const loginEmail = e.target.email.value;
    const loginPassword = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      handleClose();
    } catch (err) {
      handleAuthError(err);
    }
  };

  
  // --- Registration-Specific Logic ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    let tempErrors = { ...errors };
    let isValid = true;
    setErrors(initialErrors); // Clear previous errors

    if (activeStep === 0) { // Personal Info
      if (!formData.firstName.trim()) {
        tempErrors.firstName = 'First name is required.'; isValid = false;
      }
      if (!formData.lastName.trim()) {
        tempErrors.lastName = 'Last name is required.'; isValid = false;
      }
    } else if (activeStep === 1) { // Account Details
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address.'; isValid = false;
      }
      if (formData.password.length < 6) {
        tempErrors.password = 'Password must be at least 6 characters long.'; isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match.'; isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return; // Final validation
    
    setIsSubmitting(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // NOTE: You might want to save firstName and lastName to Firestore here
      handleClose();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Universal Error Handler ---

  const handleAuthError = (err) => {
      let friendlyErrorMessage = 'An unknown error occurred. Please try again.';
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            friendlyErrorMessage = 'Incorrect email or password. Please try again.';
            break;
        case 'auth/email-already-in-use':
          friendlyErrorMessage = 'An account with this email address already exists.';
          break;
        case 'auth/weak-password':
          friendlyErrorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          friendlyErrorMessage = 'Please enter a valid email address.';
          break;
        default:
          friendlyErrorMessage = 'An error occurred. Please check your credentials and try again.';
          break;
      }
      setError(friendlyErrorMessage);
  }

  // --- Step Content Components for Registration ---

  const getStepContent = (step) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={!!errors.firstName} helperText={errors.firstName} required autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={!!errors.lastName} helperText={errors.lastName} required />
            </Grid>
          </Grid>
        );
      case 1: // Account Details
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} error={!!errors.password} helperText={errors.password} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} required />
            </Grid>
          </Grid>
        );
      case 2: // Review
        return (
          <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Review Your Information</Typography>
              <Typography gutterBottom><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
              <Typography gutterBottom><strong>Email:</strong> {formData.email}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  By clicking "Create Account", you agree to our terms and conditions.
              </Typography>
          </Box>
        );
      default:
        throw new Error('Unknown step');
    }
  };


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isRegistering ? 'Create an Account' : 'Login'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* RENDER LOGIN OR REGISTER FORM */}
      {!isRegistering ? (
        // --- LOGIN FORM ---
        <Box component="form" onSubmit={handleLoginSubmit} noValidate>
          <DialogContent dividers>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
             <Button type="submit" fullWidth variant="contained">
              Sign In
            </Button>
          </DialogActions>
        </Box>
      ) : (
        // --- MULTI-STEP REGISTER FORM ---
        <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
            <DialogContent dividers>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>
                {getStepContent(activeStep)}
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Box>
      )}

      <DialogActions sx={{ justifyContent: 'center', p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Link component="button" variant="body2" onClick={toggleMode}>
          {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Link>
      </DialogActions>
    </Dialog>
  );
}

export default Login;