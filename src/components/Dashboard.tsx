import React from 'react';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAppointmentStore } from '../store/appointmentStore';
import WeeklyCalendar from './calendar/WeeklyCalendar';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const stats = useAppointmentStore((state) => state.getRevenueStats());
  const appointments = useAppointmentStore((state) => state.appointments);
  const services = useAppointmentStore((state) => state.services);

  const today = new Date();
  const appointmentsToday = appointments.filter(
    (apt) => new Date(apt.date).toDateString() === today.toDateString()
  ).length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const popularServices = appointments
    .filter((apt) => new Date(apt.date) >= thirtyDaysAgo)
    .reduce((acc, apt) => {
      acc[apt.service.name] = (acc[apt.service.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topServices = Object.entries(popularServices)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-gray-900 p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onTabChange('revenue')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Monthly Revenue</h3>
            <DollarSign className="text-[#8f00ff] w-6 h-6" />
          </div>
          <p className="text-2xl font-bold">£{stats.monthly}</p>
        </div>

        <div 
          className="bg-gray-900 p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onTabChange('appointments')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Today's Appointments</h3>
            <Calendar className="text-[#8f00ff] w-6 h-6" />
          </div>
          <p className="text-2xl font-bold">{appointmentsToday}</p>
        </div>

        <div 
          className="bg-gray-900 p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onTabChange('services')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Popular Services</h3>
            <TrendingUp className="text-[#8f00ff] w-6 h-6" />
          </div>
          <div className="space-y-2">
            {topServices.map(([service, count], index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{service}</span>
                <span className="text-gray-400">{count} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6">Upcoming Appointments</h3>
        <WeeklyCalendar />
      </div>
    </div>
  );
};

export default Dashboard;