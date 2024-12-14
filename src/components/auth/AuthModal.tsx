import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onToggleMode,
}) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuthStore();

  const handleSubmit = async (data: any) => {
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await login(data);
      } else {
        await register(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6">
          {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
        </h3>

        {mode === 'signin' ? (
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}

        <p className="text-center text-gray-400 mt-4">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-[#8f00ff] hover:underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;