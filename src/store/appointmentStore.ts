import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, Client, Service } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval, startOfDay, endOfDay, startOfMonth } from 'date-fns';

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

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      appointments: [],
      clients: [],
      services: [],
      bookingSettings: {
        barberName: '',
        email: '',
        calendarConnected: false,
        bookingId: '',
        workingHours: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '09:00', end: '17:00', enabled: true },
          sunday: { start: '09:00', end: '17:00', enabled: false },
        },
      },

      addAppointment: (appointment) =>
        set((state) => ({ appointments: [...state.appointments, appointment] })),

      updateAppointment: (id, appointment) =>
        set((state) => ({
          appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, ...appointment } : app
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((app) => app.id !== id),
        })),

      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),

      updateClient: (id, client) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...client } : c
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      updateService: (id, service) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...service } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      updateBookingSettings: (settings) =>
        set((state) => ({
          bookingSettings: { ...state.bookingSettings, ...settings },
        })),

      initializeBookingId: () => {
        const state = get();
        if (!state.bookingSettings.bookingId) {
          const randomId = Math.random().toString(36).substring(2, 15);
          set((state) => ({
            bookingSettings: {
              ...state.bookingSettings,
              bookingId: randomId,
            },
          }));
        }
      },

      getWeeklyAppointments: (date) => {
        const start = startOfWeek(date);
        const end = endOfWeek(date);
        const days = eachDayOfInterval({ start, end });
        return get().appointments.filter((app) => {
          const appDate = new Date(app.date);
          return appDate >= start && appDate <= end;
        });
      },

      getClientStats: () => {
        const clients = get().clients;
        const activeThreshold = new Date();
        activeThreshold.setMonth(activeThreshold.getMonth() - 3);

        const activeClients = clients.filter((client) => {
          const lastVisit = new Date(client.lastVisit);
          return lastVisit >= activeThreshold;
        });

        return {
          totalClients: clients.length,
          activeClients: activeClients.length,
        };
      },

      getRevenueStats: () => {
        const appointments = get().appointments;
        const now = new Date();
        const today = startOfDay(now);
        const endToday = endOfDay(now);
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const daily = appointments
          .filter((app) => {
            const appDate = new Date(app.date);
            return appDate >= today && 
                   appDate <= endToday && 
                   app.status === 'attended';
          })
          .reduce((sum, app) => sum + app.service.price, 0);

        const weekly = appointments
          .filter((app) => {
            const appDate = new Date(app.date);
            return appDate >= weekStart && 
                   appDate <= now && 
                   app.status === 'attended';
          })
          .reduce((sum, app) => sum + app.service.price, 0);

        const monthly = appointments
          .filter((app) => {
            const appDate = new Date(app.date);
            return appDate >= monthStart && 
                   appDate <= now && 
                   app.status === 'attended';
          })
          .reduce((sum, app) => sum + app.service.price, 0);

        return { 
          daily, 
          weekly, 
          monthly, 
          yearly: monthly * 12 // Estimated based on current month
        };
      },
    }),
    {
      name: 'appointment-store',
    }
  )
);