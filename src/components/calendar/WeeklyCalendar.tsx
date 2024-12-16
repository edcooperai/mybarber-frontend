import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { AppointmentForm } from '../appointments/AppointmentForm';
import { AppointmentEdit } from './AppointmentEdit';

export const WeeklyCalendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const appointments = useAppointmentStore((state) => state.appointments);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const updateAppointment = useAppointmentStore((state) => state.updateAppointment);
  const deleteAppointment = useAppointmentStore((state) => state.deleteAppointment);

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => setCurrentWeek(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeek(prev => addWeeks(prev, 1));

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevWeek}
            className="p-1 hover:text-[#8f00ff] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-1 hover:text-[#8f00ff] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setShowAppointmentForm(true)}
          className="flex items-center gap-2 bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Appointment
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day.toISOString()} className="space-y-2">
            <div className="text-center">
              <div className="text-sm text-gray-400">{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
            <div className="space-y-2">
              {appointments
                .filter((apt) => isSameDay(new Date(apt.date), day))
                .map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => setEditingAppointment(apt)}
                    className="w-full p-2 rounded-lg text-left text-sm"
                    style={{ backgroundColor: apt.service.color + '20' }}
                  >
                    <div className="font-medium">{format(new Date(apt.date), 'HH:mm')}</div>
                    <div>{apt.clientName}</div>
                    <div className="text-xs opacity-75">{apt.service.name}</div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showAppointmentForm && (
        <AppointmentForm
          onClose={() => setShowAppointmentForm(false)}
          onSubmit={addAppointment}
        />
      )}

      {editingAppointment && (
        <AppointmentEdit
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onUpdate={updateAppointment}
          onDelete={deleteAppointment}
        />
      )}
    </div>
  );
};