import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppointmentStore } from '../../store/appointmentStore';

const RevenueChart: React.FC = () => {
  const stats = useAppointmentStore((state) => state.getRevenueStats());

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6">Revenue Analytics</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-gray-400 text-sm">Daily</div>
          <div className="text-2xl font-bold">${stats.daily}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-gray-400 text-sm">Weekly</div>
          <div className="text-2xl font-bold">${stats.weekly}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-gray-400 text-sm">Monthly</div>
          <div className="text-2xl font-bold">${stats.monthly}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-gray-400 text-sm">Yearly</div>
          <div className="text-2xl font-bold">${stats.yearly}</div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={[
              { date: 'Mon', revenue: 1200 },
              { date: 'Tue', revenue: 900 },
              { date: 'Wed', revenue: 1500 },
              { date: 'Thu', revenue: 1800 },
              { date: 'Fri', revenue: 2000 },
              { date: 'Sat', revenue: 2500 },
              { date: 'Sun', revenue: 1000 },
            ]}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8f00ff"
              fill="#8f00ff"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;