// client/src/context/AuthContext.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext.js';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setAuth({ token: null, isAuthenticated: false, user: null });
        } else {
          setAuth({ token: token, isAuthenticated: true, user: decoded.user });
        }
      } catch (err) { // <-- FIX: Using the 'err' variable
        console.error("Failed to decode token:", err);
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, user: null });
      }
    } else {
      setAuth({ token: null, isAuthenticated: false, user: null });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setAuth({
      token,
      isAuthenticated: true,
      user: decoded.user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;