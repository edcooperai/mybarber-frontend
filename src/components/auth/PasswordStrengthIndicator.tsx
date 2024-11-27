import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'Contains number',
    test: (password) => /\d/.test(password),
  },
  {
    label: 'Contains special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getStrengthPercentage = () => {
    const metRequirements = requirements.filter((req) => req.test(password)).length;
    return (metRequirements / requirements.length) * 100;
  };

  const strengthPercentage = getStrengthPercentage();
  const strengthColor = 
    strengthPercentage <= 20 ? 'bg-red-500' :
    strengthPercentage <= 40 ? 'bg-orange-500' :
    strengthPercentage <= 60 ? 'bg-yellow-500' :
    strengthPercentage <= 80 ? 'bg-blue-500' :
    'bg-green-500';

  return (
    <div className="space-y-2">
      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {req.test(password) ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={req.test(password) ? 'text-green-500' : 'text-gray-400'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;