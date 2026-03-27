import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { authApi, googleAuth } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleCallbackHandled = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('tab_token') || localStorage.getItem('petal_token');
      if (token && !sessionStorage.getItem('tab_token')) {
        sessionStorage.setItem('tab_token', token);
      }
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('petal_token');
          sessionStorage.removeItem('tab_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code && !googleCallbackHandled.current) {
      googleCallbackHandled.current = true;
      loginWithGoogle(code).then(() => {
        window.location.replace('/');
      }).catch(err => {
        console.error("Google Auth callback failed", err);
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []);

  const loginWithGoogle = async (code) => {
    const data = await googleAuth(code, window.location.origin);
    localStorage.setItem('petal_token', data.access_token);
    sessionStorage.setItem('tab_token', data.access_token);
    const userData = await authApi.getCurrentUser();
    setUser(userData);
  };

  const login = async (credentials) => {
    const { access_token } = await authApi.login(credentials.email, credentials.password);
    localStorage.setItem('petal_token', access_token);
    sessionStorage.setItem('tab_token', access_token);
    const userData = await authApi.getCurrentUser();
    setUser(userData);
  };

  const register = async (userData) => {
    // The backend register endpoint returns the token directly
    const { access_token } = await authApi.register(userData);
    localStorage.setItem('petal_token', access_token);
    sessionStorage.setItem('tab_token', access_token);
    const updatedUser = await authApi.getCurrentUser();
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('petal_token');
    sessionStorage.removeItem('tab_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, loginWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
