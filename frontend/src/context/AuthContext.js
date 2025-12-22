import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Auth error on refresh:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password, year, section) => {
    try {
      // Pass all fields to the backend
      const { data } = await API.post('/auth/login', { email, password, year, section });
      const { token, ...userData } = data;

      localStorage.setItem('token', token);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await API.post('/auth/signup', userData);
      const { token, ...newUserData } = data;

      localStorage.setItem('token', token);
      setUser(newUserData);

      return newUserData;
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
