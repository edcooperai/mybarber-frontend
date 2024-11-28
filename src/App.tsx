import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicBookingPage from './components/booking/PublicBookingPage';
import HealthCheck from './components/HealthCheck';

// Import the Service type from src/types
import { Service as ServiceType } from './types'; // Assuming your types are in the src/types file

const App: React.FC = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  // Mock props for PublicBookingPage
  const mockBookingPageProps = {
    barberName: "John Doe",
    services: [
      { id: "1", name: "Haircut", price: 20, duration: 30, category: "Hair", color: "#000" },  // Updated to match Service type
      { id: "2", name: "Beard Trim", price: 15, duration: 15, category: "Beard", color: "#fff" }, // Updated to match Service type
    ] as ServiceType[],  // Ensure the services array matches the Service type from src/types
    workingHours: {
      Monday: { start: "09:00", end: "17:00", enabled: true },
      Tuesday: { start: "09:00", end: "17:00", enabled: true },
      Wednesday: { start: "09:00", end: "17:00", enabled: true },
      Thursday: { start: "09:00", end: "17:00", enabled: true },
      Friday: { start: "09:00", end: "17:00", enabled: true },
      Saturday: { start: "09:00", end: "14:00", enabled: true },
      Sunday: { start: "Closed", end: "Closed", enabled: false },
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
