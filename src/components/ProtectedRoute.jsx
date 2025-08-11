import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If there is no user, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If there is a user, render the page they were trying to access
  return children;
}

export default ProtectedRoute;