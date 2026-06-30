import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem('cooked_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;

      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('cooked_user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register handler
  const register = async (name, email, password, collegeName, branch, yearOfStudy) => {
    try {
      const response = await api.post('/api/auth/register', {

        name,
        email,
        password,
        collegeName,
        branch,
        yearOfStudy
      });
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('cooked_user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Save profile setup details
  const saveProfile = async (learningAreas, goals) => {
    try {
      const response = await api.put('/api/auth/profile', { learningAreas, goals });

      if (response.data.success) {
        const updatedProfile = response.data.data.profileSetup;
        const updatedUser = {
          ...user,
          profileSetup: updatedProfile
        };
        setUser(updatedUser);
        localStorage.setItem('cooked_user', JSON.stringify(updatedUser));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  // Update streak or achievements in-memory (e.g. after check-in)
  const updateUserData = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    setUser(updatedUser);
    localStorage.setItem('cooked_user', JSON.stringify(updatedUser));
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('cooked_user');
    delete api.defaults.headers.common['Authorization'];

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isProfileComplete: user?.profileSetup?.isComplete || false,
        login,
        register,
        saveProfile,
        updateUserData,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
