import React from 'react';
import { Appointment } from '../../types';
import { useAppointmentStore } from '../../store/appointmentStore';

interface AppointmentEditProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: (updatedAppointment: Appointment) => void;
  onStatusUpdate: (appointmentId: string, status: 'no-show' | 'cancelled') => void;
  services: { id: string; name: string; price: number }[];
}

const AppointmentEdit: React.FC<AppointmentEditProps> = ({
  appointment,
  onClose,
  onUpdate,
  onStatusUpdate,
  services,
}) => {
  const handleStatusChange = (status: 'no-show' | 'cancelled') => {
    onStatusUpdate(appointment.id, status);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold">Status</label>
        <select
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg"
          value={appointment.status}
          onChange={(e) => handleStatusChange(e.target.value as 'no-show' | 'cancelled')}
        >
          <option value="no-show">No Show</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {/* Other form fields */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
        >
          Close
        </button>
        <button
          onClick={() => onUpdate(appointment)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AppointmentEdit;
