import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, register, refreshToken, LoginData, RegisterData } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,

      setAuth: (token, refreshToken, user) => 
        set({ token, refreshToken, user, error: null }),

      clearAuth: () => 
        set({ token: null, refreshToken: null, user: null }),

      setError: (error) => 
        set({ error }),

      login: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await login(data);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
            isLoading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await register(data);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
            isLoading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) return;

        try {
          const response = await refreshToken(currentRefreshToken);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken
          });
        } catch (error) {
          // If refresh fails, log out the user
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