import { createContext, useContext, useState } from 'react';
import { setApiToken, api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUserEmail(data.email);
      setApiToken(data.token); // Sync the in-memory token to the API client
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.register(email, password);
      setToken(data.token);
      setUserEmail(data.email);
      setApiToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setApiToken(null); // Clear from API client memory
  };

  const value = {
    token,
    userEmail,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout
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
