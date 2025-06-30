// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layout/MainLayout';

// Pages
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import RosterPage from './components/RosterPage';
import PersonnelProfilePage from './components/PersonnelProfilePage';
import ApplicantTrackingPage from './components/ApplicantTrackingPage';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="roster" element={<RosterPage />} />
            {/* FIX: Add the missing routes back */}
            <Route path="applicants" element={<ApplicantTrackingPage />} />
            <Route path="personnel/:id" element={<PersonnelProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;