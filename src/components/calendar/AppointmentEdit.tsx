import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import type { Appointment, Service } from '../../types';

interface AppointmentEditProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Appointment>) => void;
  onStatusUpdate: (id: string, status: 'attended' | 'no-show' | 'cancelled') => void;
  services: Service[];
}

export const AppointmentEdit: React.FC<AppointmentEditProps> = ({
  appointment,
  onClose,
  onUpdate,
  onStatusUpdate,
  services,
}) => {
  const [clientName, setClientName] = useState(appointment.clientName);
  const [selectedService, setSelectedService] = useState<Service>(appointment.service);
  const [date, setDate] = useState(format(new Date(appointment.date), "yyyy-MM-dd'T'HH:mm"));
  const [selectedStatus, setSelectedStatus] = useState(appointment.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(appointment.id, {
      clientName,
      service: selectedService,
      date: new Date(date),
    });
    onClose();
  };

  const handleStatusChange = (status: 'attended' | 'no-show' | 'cancelled') => {
    setSelectedStatus(status);
    onStatusUpdate(appointment.id, status);
  };

  const isPastAppointment = new Date(appointment.date) < new Date();

  const getStatusButtonClass = (status: string) => {
    let baseClass = 'flex-1 py-2 px-4 rounded-lg transition-colors border ';
    
    switch (status) {
      case 'attended':
        baseClass += 'bg-green-600/20 hover:bg-green-600/30 ';
        break;
      case 'no-show':
        baseClass += 'bg-red-600/20 hover:bg-red-600/30 ';
        break;
      case 'cancelled':
        baseClass += 'bg-gray-600/20 hover:bg-gray-600/30 ';
        break;
    }

    if (selectedStatus === status) {
      baseClass += 'border-white';
    } else {
      baseClass += 'border-transparent hover:border-gray-400';
    }

    return baseClass;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6">Edit Appointment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Service
            </label>
            <select
              value={selectedService.id}
              onChange={(e) => {
                const service = services.find((s) => s.id === e.target.value);
                if (service) setSelectedService(service);
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
              required
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - £{service.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
              required
            />
          </div>

          {isPastAppointment && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Appointment Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('attended')}
                  className={getStatusButtonClass('attended')}
                >
                  Attended
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('no-show')}
                  className={getStatusButtonClass('no-show')}
                >
                  No Show
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('cancelled')}
                  className={getStatusButtonClass('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#8f00ff] text-white py-2 px-4 rounded-lg hover:bg-[#7a00d9] transition-colors"
          >
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
};