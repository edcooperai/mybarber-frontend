import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/landing';
import { DashboardLayout } from './components/layouts';
import { PublicBookingPage } from './components/booking';
import { HealthCheck } from './components/HealthCheck';
import { ROUTES } from './constants';

const App: React.FC = () => {
  const handleLogout = () => {
    // Implement logout logic
  };

  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={`${ROUTES.BOOKING}/:bookingId`} element={<PublicBookingPage />} />
        <Route path={`${ROUTES.DASHBOARD}/*`} element={<DashboardLayout onLogout={handleLogout} />} />
      </Routes>
      <HealthCheck />
    </>
  );
};

export default App;