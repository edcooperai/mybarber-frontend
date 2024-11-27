import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import AppointmentForm from '../appointments/AppointmentForm';
import AppointmentEdit from './AppointmentEdit';

const WeeklyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const appointments = useAppointmentStore((state) => state.appointments);
  const services = useAppointmentStore((state) => state.services);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const updateAppointment = useAppointmentStore((state) => state.updateAppointment);
  const deleteAppointment = useAppointmentStore((state) => state.deleteAppointment);

  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start, end });

  const handlePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended':
        return 'bg-green-500/20 border-green-500';
      case 'no-show':
        return 'bg-red-500/20 border-red-500';
      case 'cancelled':
        return 'bg-gray-700 border-gray-500';
      default:
        return 'border-gray-700';
    }
  };

  const handleNewAppointment = (data: any) => {
    const appointment = {
      id: Date.now().toString(),
      clientId: Date.now().toString(),
      clientName: `${data.firstName} ${data.lastName}`,
      phoneNumber: '',
      service: data.service,
      date: data.date,
      status: 'scheduled',
    };
    addAppointment(appointment);
  };

  const handleStatusUpdate = (id: string, status: 'attended' | 'no-show' | 'cancelled') => {
    updateAppointment(id, { status });
  };

  const DeleteConfirmation = ({ appointmentId }: { appointmentId: string }) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Delete Appointment</h3>
          <p className="mb-6">
            Are you sure you want to delete the appointment for {appointment.clientName}
            on {format(new Date(appointment.date), 'MMM d, yyyy HH:mm')}?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                deleteAppointment(appointmentId);
                setShowDeleteConfirm(null);
              }}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">Appointments</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousWeek}
              className="p-1 hover:text-[#8f00ff]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>{format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}</span>
            <button
              onClick={handleNextWeek}
              className="p-1 hover:text-[#8f00ff]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowNewAppointment(true)}
          className="flex items-center gap-2 bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Appointment
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day.toString()} className="space-y-2">
            <div className="text-center">
              <div className="text-sm text-gray-400">{format(day, 'EEE')}</div>
              <div className="font-semibold">{format(day, 'd')}</div>
            </div>
            <div className="space-y-2">
              {appointments
                .filter((apt) => isSameDay(new Date(apt.date), day))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${getStatusColor(appointment.status)} group relative`}
                    style={{ backgroundColor: `${appointment.service.color}20` }}
                  >
                    <div 
                      onClick={() => setEditingAppointment(appointment.id)}
                      className="w-full h-full"
                    >
                      <div className="font-semibold">{appointment.clientName}</div>
                      <div className="text-sm">{format(new Date(appointment.date), 'HH:mm')}</div>
                      <div className="text-sm opacity-75">{appointment.service.name}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(appointment.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showNewAppointment && (
        <AppointmentForm
          onClose={() => setShowNewAppointment(false)}
          onSubmit={handleNewAppointment}
          services={services}
        />
      )}

      {editingAppointment && (
        <AppointmentEdit
          appointment={appointments.find((apt) => apt.id === editingAppointment)!}
          onClose={() => setEditingAppointment(null)}
          onUpdate={updateAppointment}
          onStatusUpdate={handleStatusUpdate}
          services={services}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation appointmentId={showDeleteConfirm} />
      )}
    </div>
  );
};

export default WeeklyCalendar;