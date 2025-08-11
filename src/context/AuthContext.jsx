import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase'; // Assuming your firebase config is exported as 'app'

// 1. Create the context
const AuthContext = createContext();

// Custom hook to use the auth context easily in other components
export function useAuth() {
  return useContext(AuthContext);
}

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if auth state has been loaded

  useEffect(() => {
    const auth = getAuth(app);
    // This is the magic of Firebase. It's a listener that fires
    // whenever the user's login state changes.
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Auth state is now loaded
    });

    // Cleanup the subscription when the component unmounts
    return unsubscribe;
  }, []);

  function logout() {
    const auth = getAuth(app);
    return signOut(auth);
  }

  const value = {
    currentUser,
    logout,
  };

  // Render the children only when the auth state has been determined
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}