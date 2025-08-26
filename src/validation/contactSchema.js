// src/contactSchema.js
import * as yup from 'yup';

const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full Name is required.')
    // Use Yup's `matches` method for regex validation
    .matches(/^[A-Za-z\s]+$/, 'Full Name can only contain letters and spaces.'),

  email: yup
    .string()
    .email('Please enter a valid email address.') // Yup has a built-in email validator
    .required('Email Address is required.'),

  phone: yup
    .string()
    .required('Mobile Number is required.')
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),

  message: yup
    .string()
    .required('Message is required.'),
});

export default contactSchema;