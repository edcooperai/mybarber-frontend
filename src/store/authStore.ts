import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth/authService';
import type { User } from '../types/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,

      setAuth: (token, refreshToken, user) => 
        set({ token, refreshToken, user }),

      clearAuth: () => 
        set({ token: null, refreshToken: null, user: null }),

      refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(currentRefreshToken);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user
          });
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user
      })
    }
  )
);