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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const auth = getAuth(app);

function Login({ open, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    // Reset state when closing the modal
    setError('');
    setIsRegistering(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose(); // Close the modal on success
    } catch (err) {
      let friendlyErrorMessage = 'An unknown error occurred. Please try again.';
      switch (err.code) {
        case 'auth/user-not-found':
          friendlyErrorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          friendlyErrorMessage = 'Incorrect password. Please try again.';
          break;
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
          friendlyErrorMessage = 'Failed to sign in. Please check your credentials.';
          break;
      }
      setError(friendlyErrorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth name="password" label="Password" type="password" id="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Link component="button" variant="body2" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Link>
      </DialogActions>
    </Dialog>
  );
}

export default Login;