import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setStoredToken, getStoredToken } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadCurrentUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // User is not signed in
      setUser(null);
      setStoredToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.token) {
        setStoredToken(res.token);
      }
      setUser(res.user);
      addToast(`Welcome back, ${res.user.name}.`, 'success');
      return { success: true, user: res.user };
    } catch (error) {
      addToast(error.message || 'Login failed. Please check your credentials.', 'error');
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.register({ name, email, password });
      if (res.token) {
        setStoredToken(res.token);
      }
      setUser(res.user);
      addToast('Account created successfully. Welcome to NOVA SUPPLY.', 'success');
      return { success: true, user: res.user };
    } catch (error) {
      addToast(error.message || 'Registration failed.', 'error');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    setStoredToken(null);
    setUser(null);
    addToast('You have been signed out.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      addToast('Profile updated successfully.', 'success');
      return { success: true };
    } catch (error) {
      addToast(error.message || 'Could not update profile.', 'error');
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: loadCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
