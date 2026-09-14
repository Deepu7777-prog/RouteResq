import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('routeresq_token'));
  const [loading, setLoading] = useState(true);

  // Validate existing JWT token on app boot
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('JWT session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (data.success && data.token) {
        localStorage.setItem('routeresq_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed.' };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      if (data.success && data.token) {
        localStorage.setItem('routeresq_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed.' };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('routeresq_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
