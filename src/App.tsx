import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicBookingPage from './components/booking/PublicBookingPage';
import HealthCheck from './components/HealthCheck';

const App: React.FC = () => {
  const handleLogout = () => {
    // Temporary no-op
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book/:bookingId" element={<PublicBookingPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout onLogout={handleLogout} />} />
      </Routes>
      <HealthCheck />
    </Router>
  );
};

export default App;