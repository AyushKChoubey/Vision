import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.auth.getMe();
      if (response.status === 'success' && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.auth.login({ email, password });
      
      if (response.status === 'success' && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, firstName, lastName) => {
    setLoading(true);
    try {
      const response = await apiService.auth.register({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      if (response.status === 'success' && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await apiService.auth.logout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.users.updateProfile(profileData);
      
      if (response.status === 'success' && response.data.user) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.auth.updatePassword({
        currentPassword,
        password: newPassword
      });
      
      if (response.status === 'success') {
        return { success: true };
      } else {
        throw new Error(response.message || 'Password update failed');
      }
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};