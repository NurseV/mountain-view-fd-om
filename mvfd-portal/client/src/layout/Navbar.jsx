// client/src/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Styles are unchanged
  const navbarStyle = { /* ... */ };
  const linkStyle = { textDecoration: 'none', color: 'blue', marginRight: '1rem' };
  const buttonStyle = { /* ... */ };

  return (
    <nav style={navbarStyle}>
      <div>
        <strong>MVFD Portal</strong>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/roster" style={linkStyle}>Roster</Link>
        <Link to="/applicants" style={linkStyle}>Applicants</Link>
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