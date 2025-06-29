// client/src/layout/Navbar.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  };

  return (
    <nav style={navbarStyle}>
      <div>
        <strong>MVFD Portal</strong>
      </div>
      <div>
        <span>Welcome, {user?.firstName} ({user?.role})</span>
        <button onClick={logout} style={buttonStyle}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;