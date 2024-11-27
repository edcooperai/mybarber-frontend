import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { setup2FA, verify2FA } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

interface TwoFactorSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSuccess, onCancel }) => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await setup2FA(token!);
      setSecret(response.secret);
      setQrCode(response.qrCode);
    } catch (err) {
      setError('Failed to setup 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      await verify2FA(token!, verificationCode);
      onSuccess();
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!secret ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Two-factor authentication adds an extra layer of security to your account.
          </p>
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="bg-[#8f00ff] text-white px-6 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : 'Setup 2FA'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg w-fit mx-auto">
            <QRCodeSVG value={qrCode} size={200} />
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-2">
              Scan the QR code with your authenticator app or enter this code manually:
            </p>
            <code className="bg-gray-800 px-4 py-2 rounded-lg text-[#8f00ff] font-mono">
              {secret}
            </code>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                placeholder="Enter 6-digit code"
                maxLength={6}
                pattern="\d{6}"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 bg-[#8f00ff] text-white py-2 px-4 rounded-lg hover:bg-[#7a00d9] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;