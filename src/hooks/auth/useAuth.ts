import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth/authService';
import { LoginData, RegisterData } from '../../types/auth';
import { ROUTES } from '../../constants';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    token,
    user,
    setAuth,
    clearAuth,
  } = useAuthStore();

  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast.success('Successfully signed in!');
      navigate(ROUTES.DASHBOARD);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to sign in';
      toast.error(message);
      throw error;
    }
  }, [navigate, setAuth]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast.success('Successfully registered! Please verify your email.');
      navigate(ROUTES.DASHBOARD);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to register';
      toast.error(message);
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