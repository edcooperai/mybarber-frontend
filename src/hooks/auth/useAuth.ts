import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth/authService';
import { LoginData, RegisterData } from '../../types/auth';
import { ROUTES } from '../../constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    setAuth, 
    clearAuth, 
    token, 
    user, 
    setError 
  } = useAuthStore();

  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Authentication failed');
      throw error;
    }
  }, [navigate, setAuth, setError]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  }, [navigate, setAuth, setError]);

  const logout = useCallback(() => {
    clearAuth();
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