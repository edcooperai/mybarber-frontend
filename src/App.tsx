import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicBookingPage from './components/booking/PublicBookingPage';
import HealthCheck from './components/HealthCheck';

// Define the Service type to match the mock data
type Service = {
  id: number;
  name: string;
  price: number;
  duration?: string;
  category?: string;
  color?: string;
};

const App: React.FC = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  // Mock props for PublicBookingPage
  const mockBookingPageProps = {
    barberName: "John Doe",
    services: [
      { id: 1, name: "Haircut", price: 20 },
      { id: 2, name: "Beard Trim", price: 15 },
    ] as Service[], // Ensure the services array matches the Service type
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    appointments: [
      { id: "1", time: "10:00", clientName: "Alice" },
      { id: "2", time: "11:00", clientName: "Bob" },
    ],
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book/:bookingId" element={<PublicBookingPage {...mockBookingPageProps} />} />
        <Route path="/dashboard/*" element={<DashboardLayout onLogout={handleLogout} />} />
      </Routes>
      <HealthCheck />
    </Router>
  );
};

export default App;
