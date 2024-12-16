import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants';
import type { LoginData, RegisterData } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    login: loginAction, 
    register: registerAction, 
    logout: logoutAction,
    token,
    user,
    refreshToken: refreshTokenAction
  } = useAuthStore();

  const isAuthenticated = !!token;

  const login = useCallback(async (data: LoginData) => {
    try {
      await loginAction(data);
      navigate(ROUTES.DASHBOARD);
      return true;
    } catch (error) {
      throw error;
    }
  }, [loginAction, navigate]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      await registerAction(data);
      navigate(ROUTES.DASHBOARD);
      return true;
    } catch (error) {
      throw error;
    }
  }, [registerAction, navigate]);

  const logout = useCallback(() => {
    logoutAction();
    navigate(ROUTES.HOME);
  }, [logoutAction, navigate]);

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout
  };
};