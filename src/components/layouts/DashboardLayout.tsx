import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Dashboard from '../Dashboard';
import WeeklyCalendar from '../calendar/WeeklyCalendar';
import RevenueAnalytics from '../analytics/RevenueAnalytics';
import ServiceManager from '../services/ServiceManager';
import BookingSettings from '../booking/BookingSettings';
import Settings from '../settings/Settings';
import ClientManager from '../clients/ClientManager';
import { usePageTitle } from '../../utils/pageTitle';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'dashboard';

  // Set page title based on current section
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    revenue: 'Revenue Analytics',
    booking: 'Booking Settings',
    clients: 'Client Management',
    settings: 'Settings',
  };
  usePageTitle(titles[currentPath] || 'Dashboard');

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/${tab === 'dashboard' ? '' : tab}`);
  };

  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard':
        return <Dashboard onTabChange={handleTabChange} />;
      case 'appointments':
        return <WeeklyCalendar />;
      case 'revenue':
        return <RevenueAnalytics />;
      case 'booking':
        return <BookingSettings />;
      case 'clients':
        return <ClientManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar 
        activeTab={currentPath} 
        onTabChange={handleTabChange}
        onLogout={onLogout}
      />
      <div className="ml-0 md:ml-64 p-4 sm:p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;