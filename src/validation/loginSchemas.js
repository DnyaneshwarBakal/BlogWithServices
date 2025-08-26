import * as Yup from 'yup';

// Schema for the login form
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

// Schema for the multi-step registration form
export const registerSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('First name is required.'),
  lastName: Yup.string().trim().required('Last name is required.'),
  email: Yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long.').required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    .required('Please confirm your password.'),
});