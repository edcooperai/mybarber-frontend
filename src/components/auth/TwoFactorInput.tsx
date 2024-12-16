import React from 'react';
import { Shield } from 'lucide-react';

interface TwoFactorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TwoFactorInput: React.FC<TwoFactorInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        Two-Factor Authentication Code
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
          placeholder="Enter 6-digit code"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
      </div>
      <p className="mt-1 text-sm text-gray-400">
        Enter the verification code from your authenticator app
      </p>
    </div>
  );
};