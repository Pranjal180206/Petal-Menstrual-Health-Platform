import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('petal_token');
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('petal_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { access_token } = await authApi.login(credentials.email, credentials.password);
    localStorage.setItem('petal_token', access_token);
    const userData = await authApi.getCurrentUser();
    setUser(userData);
  };

  const register = async (userData) => {
    // The backend register endpoint returns the token directly
    const { access_token } = await authApi.register(userData);
    localStorage.setItem('petal_token', access_token);
    const updatedUser = await authApi.getCurrentUser();
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('petal_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
