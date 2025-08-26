import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { app } from '../firebase';
import { registerSchema, loginSchema } from '../validation/loginSchemas';
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

// =============================================================================
// STEP COMPONENTS
// =============================================================================

const PersonalInfoStep = ({ formData, handleInputChange, errors }) => (
  <Grid container spacing={2} sx={{ mt: 1 }}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        required
        autoFocus
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        required
      />
    </Grid>
  </Grid>
);

const AccountDetailsStep = ({ formData, handleInputChange, errors, onEmailBlur, isCheckingEmail }) => (
  <Grid container spacing={2} sx={{ mt: 1 }}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={onEmailBlur}
        error={!!errors.email}
        helperText={errors.email}
        required
        InputProps={{
          endAdornment: (
            <>
              {isCheckingEmail && <CircularProgress size={20} />}
            </>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} error={!!errors.password} helperText={errors.password} required />
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} required />
    </Grid>
  </Grid>
);

const ReviewStep = ({ formData }) => (
  <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
    <Typography variant="h6" gutterBottom>Review Your Information</Typography>
    <Typography gutterBottom><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
    <Typography gutterBottom><strong>Email:</strong> {formData.email}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      By clicking "Create Account", you agree to our terms and conditions.
    </Typography>
  </Box>
);

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const steps = [
  { label: 'Personal Information', component: PersonalInfoStep },
  { label: 'Account Details', component: AccountDetailsStep },
  { label: 'Review & Create', component: ReviewStep },
];

const initialFormData = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
const initialErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

// =============================================================================
// MAIN LOGIN COMPONENT
// =============================================================================

function Login({ open, onClose }) {
  // --- STATE MANAGEMENT ---
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // --- HANDLER FUNCTIONS ---

  const handleClose = () => {
    onClose();
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
      setFormData(initialFormData);
      setActiveStep(0);
    }
    setIsRegistering(!isRegistering);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      default:
        break;
    }
    setError(friendlyErrorMessage);
  };
  
  const handleEmailBlur = async (e) => {
    const email = e.target.value;
    setErrors((prev) => ({ ...prev, email: '' }));

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsCheckingEmail(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setErrors((prev) => ({ ...prev, email: 'An account with this email already exists.' }));
      }
    } catch (err) {
      console.error("Error checking email:", err);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const loginData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await loginSchema.validate(loginData);
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      handleClose();
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.message);
      } else {
        handleAuthError(err);
      }
    }
  };

  const validateStep = async () => {
    const fieldsByStep = [['firstName', 'lastName'], ['email', 'password', 'confirmPassword']];
    const stepSchema = registerSchema.pick(fieldsByStep[activeStep] || []);
    try {
      setErrors(initialErrors);
      await stepSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = err.inner.reduce((acc, current) => ({ ...acc, [current.path]: current.message }), {});
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();
    if (!isStepValid) return;

    if (activeStep === 1) { // If on the account details step
      setIsCheckingEmail(true);
      try {
        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        if (methods.length > 0) {
          setErrors((prev) => ({ ...prev, email: 'This email address is already in use.' }));
          setIsCheckingEmail(false);
          return; // Stop the user from advancing
        }
      } catch (err) {
        console.error("Error re-checking email:", err);
        setError("Could not verify email. Please try again.");
        setIsCheckingEmail(false);
        return; // Stop on error
      }
      setIsCheckingEmail(false);
    }
    
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      
      const methods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (methods.length > 0) {
        setErrors((p) => ({...p, email: 'This email is already taken.'}));
        setIsSubmitting(false);
        setActiveStep(1); // Send user back to the email step
        return;
      }

      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      handleClose();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = err.inner.reduce((acc, current) => ({...acc, [current.path]: current.message}), {});
        setErrors(newErrors);
      } else {
        handleAuthError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER LOGIC ---

  const ActiveStepComponent = steps[activeStep].component;

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

      {!isRegistering ? (
        // LOGIN FORM
        <Box component="form" onSubmit={handleLoginSubmit} noValidate>
          <DialogContent dividers>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" />
            {error && <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
             <Button type="submit" fullWidth variant="contained">Sign In</Button>
          </DialogActions>
        </Box>
      ) : (
        // REGISTER STEPPER FORM
        <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
            <DialogContent dividers>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map((step) => <Step key={step.label}><StepLabel>{step.label}</StepLabel></Step>)}
                </Stepper>
                
                <ActiveStepComponent 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  errors={errors} 
                  onEmailBlur={handleEmailBlur}
                  isCheckingEmail={isCheckingEmail}
                />

                {error && <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || isCheckingEmail}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext} disabled={isCheckingEmail}>
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