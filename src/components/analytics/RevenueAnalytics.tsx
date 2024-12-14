import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays, subMonths, subYears, isBefore, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, addYears, addWeeks } from 'date-fns';
import { useAppointmentStore } from '../../store/appointmentStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TimeFrame = 'week' | 'month' | 'year';

const RevenueAnalytics: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const appointments = useAppointmentStore((state) => state.appointments);
  const services = useAppointmentStore((state) => state.services);

  const getRevenueForPeriod = (start: Date, end: Date) => {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= start && 
               aptDate <= end && 
               apt.status === 'attended';
      })
      .reduce((sum, apt) => sum + apt.service.price, 0);
  };

  const getRevenueByService = () => {
    const today = new Date();
    let startDate;

    switch (timeFrame) {
      case 'week':
        startDate = subDays(currentDate, 6);
        break;
      case 'month':
        startDate = startOfMonth(currentDate);
        break;
      case 'year':
        startDate = startOfYear(currentDate);
        break;
    }

    return services.map(service => {
      const serviceAppointments = appointments.filter(apt => 
        apt.service.id === service.id &&
        new Date(apt.date) >= startDate &&
        new Date(apt.date) <= today &&
        apt.status === 'attended'
      );

      return {
        name: service.name,
        value: serviceAppointments.reduce((sum, apt) => sum + apt.service.price, 0),
        color: service.color,
      };
    }).filter(service => service.value > 0);
  };

  const generateChartData = () => {
    const today = endOfDay(new Date());
    let data;

    switch (timeFrame) {
      case 'week':
        data = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(currentDate, 6 - i);
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);
          return {
            date: format(date, 'EEE'),
            fullDate: format(date, 'MMM d'),
            revenue: isBefore(date, today) ? getRevenueForPeriod(dayStart, dayEnd) : 0,
          };
        });
        break;
      case 'month':
        data = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(currentDate, 29 - i);
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);
          return {
            date: format(date, 'd'),
            fullDate: format(date, 'MMM d'),
            revenue: isBefore(date, today) ? getRevenueForPeriod(dayStart, dayEnd) : 0,
            showLabel: i % 5 === 0,
          };
        });
        break;
      case 'year':
        data = Array.from({ length: 12 }, (_, i) => {
          const date = subMonths(currentDate, 11 - i);
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          return {
            date: format(date, 'MMM'),
            fullDate: format(date, 'MMM yyyy'),
            revenue: isBefore(date, today) ? getRevenueForPeriod(monthStart, monthEnd) : 0,
          };
        });
        break;
    }

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    return { data, totalRevenue };
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const today = new Date();
    let newDate;

    switch (timeFrame) {
      case 'week':
        newDate = direction === 'prev' 
          ? subDays(currentDate, 7) 
          : addWeeks(currentDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev'
          ? subMonths(currentDate, 1)
          : addMonths(currentDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev'
          ? subYears(currentDate, 1)
          : addYears(currentDate, 1);
        break;
    }

    if (isBefore(newDate, today) || direction === 'prev') {
      setCurrentDate(newDate);
    }
  };

  const revenueByService = getRevenueByService();
  const { data: chartData, totalRevenue } = generateChartData();
  const hasData = totalRevenue > 0;
  const hasServiceData = revenueByService.some(service => service.value > 0);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Revenue Overview</h3>
            <p className="text-gray-400 mt-1">
              Total Revenue: <span className="text-white font-semibold">£{totalRevenue.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {(['week', 'month', 'year'] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeFrame(tf);
                    setCurrentDate(new Date());
                  }}
                  className={`px-4 py-1 rounded-md ${
                    timeFrame === tf
                      ? 'bg-[#8f00ff] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-1 hover:text-[#8f00ff]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm min-w-[100px] text-center">
                {format(currentDate, 
                  timeFrame === 'week' 
                    ? "'Week of' MMM d" 
                    : timeFrame === 'month' 
                      ? 'MMMM yyyy' 
                      : 'yyyy'
                )}
              </span>
              <button
                onClick={() => handleNavigate('next')}
                className="p-1 hover:text-[#8f00ff]"
                disabled={isBefore(new Date(), currentDate)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-[300px] relative">
          {!hasData ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No revenue data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(value, index) => {
                    const item = chartData[index];
                    return timeFrame === 'month' && item ? (item.showLabel ? value : '') : value;
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `£${value}`}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`£${value}`, 'Revenue']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return label;
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Revenue by Service</h3>
          <div className="h-[300px] relative">
            {!hasServiceData ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No service revenue data available for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByService}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tickFormatter={(value) => `£${value}`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`£${value}`, 'Revenue']}
                  />
                  <Bar dataKey="value">
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Service Distribution</h3>
          <div className="h-[300px] relative">
            {!hasServiceData ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No service distribution data available for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`£${value}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;