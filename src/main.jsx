import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { LoginModalProvider } from './context/LoginModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BlogProvider>
        <LoginModalProvider>
          <App />
        </LoginModalProvider>
      </BlogProvider>
    </AuthProvider>
  </React.StrictMode>,
);