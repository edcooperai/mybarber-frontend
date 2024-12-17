import { LoginData, RegisterData } from '../../types/auth';
import { validateEmail, validatePassword } from '../../utils/validation';

export const validateLoginData = (data: LoginData): { isValid: boolean; error?: string } => {
  if (!validateEmail(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!data.password || data.password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  return { isValid: true };
};

export const validateRegisterData = (data: RegisterData): { isValid: boolean; error?: string } => {
  if (!validateEmail(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return { isValid: false, error: passwordValidation.errors[0] };
  }

  if (!data.name || data.name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }

  return { isValid: true };
};