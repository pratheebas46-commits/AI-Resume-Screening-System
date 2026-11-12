import React, { createContext, useContext } from 'react';

/**
 * Simplified AuthContext for local/offline use.
 * Authentication is bypassed — the app runs without login.
 */

const AuthContext = createContext();

const LOCAL_USER = { id: 'local-user', email: 'local@localhost', name: 'Local User' };

export const AuthProvider = ({ children }) => {
  const value = {
    user: LOCAL_USER,
    isAuthenticated: true,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    authChecked: true,
    appPublicSettings: null,
    logout: () => {},
    navigateToLogin: () => {},
    checkUserAuth: async () => LOCAL_USER,
    checkAppState: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
