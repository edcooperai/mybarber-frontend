import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalendarState {
  isConnected: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  error: string | null;
  setTokens: (tokens: { access_token: string; refresh_token?: string; expires_in: number }) => void;
  disconnect: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      isConnected: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      error: null,
      setTokens: (tokens) =>
        set({
          isConnected: true,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt: Date.now() + tokens.expires_in * 1000,
          error: null,
        }),
      disconnect: () =>
        set({
          isConnected: false,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'calendar-storage',
    }
  )
);