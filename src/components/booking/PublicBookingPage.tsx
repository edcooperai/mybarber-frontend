import React, { useState } from 'react';
import { format, addDays, startOfDay, isBefore, isAfter, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingForm from '../BookingForm';
import { Service } from '../../types';
import { usePageTitle } from '../../utils/pageTitle';

interface PublicBookingPageProps {
  barberName: string;
  services: Service[];
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      enabled: boolean;
    };
  };
  appointments: {
    id: string;
    time: string;
    clientName: string;
  }[];
}

const PublicBookingPage: React.FC<PublicBookingPageProps> = ({
  barberName,
  services,
  workingHours,
  appointments,
}) => {
  usePageTitle(`Book with ${barberName}`);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateTimeSlots = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    const daySchedule = workingHours[dayOfWeek];

    if (!daySchedule?.enabled) return [];

    const slots: string[] = [];
    const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
    const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
    
    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0);

    while (currentTime < endTime) {
      // Check if the slot is at least 24 hours in advance
      if (isAfter(currentTime, addDays(new Date(), 1))) {
        // Check if the slot conflicts with any existing appointments
        const isSlotAvailable = !appointments.some(apt => {
          const aptStart = new Date(apt.time);
          const aptEnd = new Date(aptStart.getTime() + 30 * 60000); // Assuming 30-minute duration for appointments
          const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
          return (
            (currentTime >= aptStart && currentTime < aptEnd) ||
            (slotEnd > aptStart && slotEnd <= aptEnd)
          );
        });

        if (isSlotAvailable) {
          slots.push(format(currentTime, 'HH:mm'));
        }
      }
      
      // Add 30 minutes to the slot
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return slots;
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    const daySchedule = workingHours[dayOfWeek];
    
    // Check if the day is enabled and at least 24 hours in advance
    if (!daySchedule?.enabled || !isAfter(date, addDays(new Date(), 1))) {
      return false;
    }

    // Check if there are any available time slots
    const timeSlots = generateTimeSlots(date);
    return timeSlots.length > 0;
  };

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = startOfDay(currentMonth);
    
    for (let i = 0; i < 42; i++) {
      const date = addDays(firstDay, i);
      const isAvailable = isDateAvailable(date);
      
      days.push({
        date,
        isAvailable,
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isPast: isBefore(date, addDays(new Date(), 1)),
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleSubmit = (data: any) => {
    // Handle booking submission
    console.log('Booking submitted:', data);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{barberName}</h1>
          <p className="text-gray-400">Select a date and time for your appointment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                  className="p-1 hover:text-[#8f00ff]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span>{format(currentMonth, 'MMMM yyyy')}</span>
                <button
                  onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                  className="p-1 hover:text-[#8f00ff]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map(({ date, isAvailable, isSelected, isPast }, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={!isAvailable || isPast}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm
                    ${isSelected ? 'bg-[#8f00ff] text-white' : ''}
                    ${isAvailable && !isPast ? 'hover:bg-[#8f00ff] hover:bg-opacity-50' : ''}
                    ${!isAvailable || isPast ? 'text-gray-600 cursor-not-allowed' : ''}
                    ${isAvailable && !isSelected ? 'border border-[#8f00ff]' : ''}
                  `}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5" />
              {selectedDate ? 'Select Time' : 'Choose a Date'}
            </h2>

            {selectedDate ? (
              <div className="space-y-4">
                <div className="text-gray-400 mb-4">
                  Available times for {format(selectedDate, 'MMMM d, yyyy')}:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {generateTimeSlots(selectedDate).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-2 px-4 rounded-lg text-center
                        ${selectedTime === time ? 'bg-[#8f00ff] text-white' : 'border border-[#8f00ff] hover:bg-[#8f00ff] hover:bg-opacity-50'}
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Please select a date to view available time slots
              </div>
            )}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Complete Your Booking</h2>
            <BookingForm
              onSubmit={handleSubmit}
              services={services}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        )}

        <div className="text-center text-gray-400 text-sm mt-8">
          Powered by <a href="https://mybarber.ai" className="text-[#8f00ff] hover:underline">mybarber.ai</a>
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;
