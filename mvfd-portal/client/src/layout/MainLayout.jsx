// client/src/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default MainLayout;