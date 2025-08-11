import React, { createContext, useState, useContext } from 'react';
import Login from '../components/Login';

const LoginModalContext = createContext();

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const value = {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <Login open={isLoginModalOpen} onClose={closeLoginModal} />
    </LoginModalContext.Provider>
  );
}