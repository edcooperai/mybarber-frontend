import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, Client, Service } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface BookingSettings {
  barberName: string;
  email: string;
  calendarConnected: boolean;
  bookingId: string;
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      enabled: boolean;
    };
  };
}

interface AppointmentStore {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  bookingSettings: BookingSettings;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  updateBookingSettings: (settings: Partial<BookingSettings>) => void;
  initializeBookingId: () => void;
  getWeeklyAppointments: (date: Date) => Appointment[];
  getClientStats: () => { totalClients: number; activeClients: number };
  getRevenueStats: () => { daily: number; weekly: number; monthly: number; yearly: number };
}

export const useAppointmentStore = create<AppointmentStore>(
  persist(
    (set) => ({
      appointments: [],
      clients: [],
      services: [],
      bookingSettings: {
        barberName: '',
        email: '',
        calendarConnected: false,
        bookingId: '',
        workingHours: {
          Monday: { start: '09:00', end: '17:00', enabled: true },
          Tuesday: { start: '09:00', end: '17:00', enabled: true },
          Wednesday: { start: '09:00', end: '17:00', enabled: true },
          Thursday: { start: '09:00', end: '17:00', enabled: true },
          Friday: { start: '09:00', end: '17:00', enabled: true },
          Saturday: { start: '09:00', end: '17:00', enabled: true },
          Sunday: { start: '09:00', end: '17:00', enabled: false },
        },
      },
      addAppointment: (appointment: Appointment) => set((state) => ({
        appointments: [...state.appointments, appointment],
      })),
      updateAppointment: (id: string, appointment: Partial<Appointment>) => set((state) => ({
        appointments: state.appointments.map((app) => app.id === id ? { ...app, ...appointment } : app),
      })),
      deleteAppointment: (id: string) => set((state) => ({
        appointments: state.appointments.filter((app) => app.id !== id),
      })),
      // Other methods for clients, services, and settings...
      getWeeklyAppointments: (date: Date) => {
        const start = startOfWeek(date);
        const end = endOfWeek(date);
        return state.appointments.filter((apt) => {
          const appointmentDate = new Date(apt.date);
          return appointmentDate >= start && appointmentDate <= end;
        });
      },
    }),
    { name: 'appointment-store' }
  )
);
