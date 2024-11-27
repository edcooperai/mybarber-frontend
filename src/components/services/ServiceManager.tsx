import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Service } from '../../types';
import { useAppointmentStore } from '../../store/appointmentStore';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, format, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears, isBefore } from 'date-fns';

type TimeFrame = 'week' | 'month' | 'year';

const PRESET_COLORS = [
  '#8f00ff', // Violet
  '#ff0066', // Pink
  '#00cc88', // Teal
  '#3366ff', // Blue
  '#ff9900', // Orange
  '#ff3333', // Red
];

const ServiceManager: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const services = useAppointmentStore((state) => state.services);
  const appointments = useAppointmentStore((state) => state.appointments);
  const addService = useAppointmentStore((state) => state.addService);
  const updateService = useAppointmentStore((state) => state.updateService);
  const deleteService = useAppointmentStore((state) => state.deleteService);

  const [formData, setFormData] = useState({
    name: '',
    duration: '30',
    price: '0',
    color: PRESET_COLORS[0],
    description: '',
  });

  const getServiceStats = () => {
    const now = new Date();
    let startDate;
    let endDate;

    switch (timeFrame) {
      case 'week':
        startDate = startOfWeek(currentDate);
        endDate = endOfWeek(currentDate);
        break;
      case 'month':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case 'year':
        startDate = startOfYear(currentDate);
        endDate = endOfYear(currentDate);
        break;
    }

    return services.map(service => {
      const bookings = appointments.filter(apt => 
        apt.service.id === service.id &&
        new Date(apt.date) >= startDate &&
        new Date(apt.date) <= endDate
      );

      const revenue = bookings.reduce((sum, apt) => sum + apt.service.price, 0);

      return {
        name: service.name,
        bookings: bookings.length,
        revenue,
        color: service.color
      };
    }).sort((a, b) => b.bookings - a.bookings);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const today = new Date();
    let newDate;

    switch (timeFrame) {
      case 'week':
        newDate = direction === 'prev' 
          ? subWeeks(currentDate, 1) 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      duration: parseInt(formData.duration, 10),
      price: parseFloat(formData.price),
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService({
        id: Date.now().toString(),
        ...serviceData,
      } as Service);
    }
    setIsAdding(false);
    setEditingService(null);
    setFormData({
      name: '',
      duration: '30',
      price: '0',
      color: PRESET_COLORS[0],
      description: '',
    });
  };

  const handleServiceEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration: service.duration.toString(),
      price: service.price.toString(),
      color: service.color,
      description: service.description || '',
    });
    setIsAdding(true);
  };

  const serviceStats = getServiceStats();
  const hasData = serviceStats.some(stat => stat.bookings > 0);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Services</h3>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {(isAdding || editingService) && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Price (£)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors"
              >
                {editingService ? 'Update' : 'Add'} Service
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingService(null);
                  setFormData({
                    name: '',
                    duration: '30',
                    price: '0',
                    color: PRESET_COLORS[0],
                    description: '',
                  });
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-lg"
              style={{ backgroundColor: service.color + '20' }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{service.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleServiceEdit(service)}
                    className="p-1 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-1 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm opacity-90">
                <span>Duration:</span> {service.duration}min
              </div>
              <div className="text-sm opacity-90">
                <span>Price:</span> £{service.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Service Analytics
          </h4>
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
              No data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={serviceStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => value.toString()}
                  domain={[0, 'auto']}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'bookings') return [value, 'Bookings'];
                    if (name === 'revenue') return [`£${value}`, 'Revenue'];
                    return [value, name];
                  }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#8f00ff"
                  name="Bookings"
                  radius={[0, 4, 4, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;