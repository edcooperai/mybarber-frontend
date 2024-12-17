import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth/authService';
import { LoginData, RegisterData } from '../types';
import { ROUTES } from '../constants';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { token, user, setAuth, clearAuth } = useAuthStore();

  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast.success('Successfully signed in!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  }, [navigate, setAuth]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast.success('Account created successfully! Please verify your email.');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  }, [navigate, setAuth]);

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Successfully signed out');
    navigate(ROUTES.HOME);
  }, [clearAuth, navigate]);

  return {
    isAuthenticated: !!token,
    user,
    token,
    login,
    register,
    logout
  };
};