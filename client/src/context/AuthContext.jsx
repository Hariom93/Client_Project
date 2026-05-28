import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiCall } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Global toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load user profile on startup if token exists
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiCall('/api/auth/profile');
        if (response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error loading startup profile:', error.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        // Load full profile details
        const profileResponse = await apiCall('/api/auth/profile');
        setUser(profileResponse.data);
        showToast('Successfully logged in!', 'success');
        return response.data;
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please check credentials.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone })
      });

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        // Load full profile details
        const profileResponse = await apiCall('/api/auth/profile');
        setUser(profileResponse.data);
        showToast('Registration successful! Please wait for admin approval if required.', 'success');
        return response.data;
      }
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const loginWithGoogle = async (credential) => {
    setLoading(true);
    try {
      const response = await apiCall('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential })
      });

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        const profileResponse = await apiCall('/api/auth/profile');
        setUser(profileResponse.data);
        showToast('Google login successful!', 'success');
        return response.data;
      }
    } catch (error) {
      showToast(error.message || 'Google login failed.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully', 'success');
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const response = await apiCall('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success) {
        setUser(response.data);
        showToast('Profile updated successfully!', 'success');
        return response.data;
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile.', 'error');
      throw error;
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        isAdmin,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
