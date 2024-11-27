export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  service: Service;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  color: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  lastVisit: Date;
  totalVisits: number;
  preferredServices: string[];
  notes?: string;
  loyaltyPoints: number;
}

export interface DashboardStats {
  totalRevenue: number;
  appointmentsToday: number;
  upcomingAppointments: number;
  popularServices: { service: string; count: number }[];
  revenueData: {
    date: string;
    revenue: number;
  }[];
}